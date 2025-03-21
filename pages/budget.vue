<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { CURRENCIES } from '~/lib/constants/currencies'
import { useFilter } from 'reka-ui'

// Types
interface Tag {
  id: string
  name: string
}

interface Budget {
  id: string
  name: string
  amount: number
  currency_code: string
  tags: Tag[]
  period: string
  start_date: string
  end_date: string | null
  is_one_time_purchase: boolean
  created_at: string
  updated_at: string
}

// State
const client = useSupabaseClient()
const user = useSupabaseUser()

const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())
const budgets = ref<Budget[]>([])
const isLoading = ref(false)
const error = ref('')
const editingItemId = ref<string | null>(null)

// New budget form
const newItem = reactive({
  name: '',
  amount: 0,
  currency_code: 'USD',
  tags: [] as Tag[],
  period: 'monthly',
  is_one_time_purchase: false,
})

// Edit item form
const editItem = reactive({
  id: '',
  name: '',
  amount: 0,
  currency_code: 'USD',
  tags: [] as Tag[],
  period: 'monthly',
  is_one_time_purchase: false,
})

// Tags state
const tags = ref<Tag[]>([])
const tagsQuery = ref('')
const isCreatingTag = ref(false)
const openTagsCombobox = ref(false)

// Computed
const months = computed(() => [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
])

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

const { contains } = useFilter({ sensitivity: 'base' })

const filteredTags = computed(() => {
  const options = tags.value.filter(tag => !newItem.tags.some(t => t.id === tag.id))
  return tagsQuery.value ? options.filter(tag => contains(tag.name, tagsQuery.value)) : options
})

// Methods
async function fetchBudgets() {
  if (!user.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Calculate start and end date for the selected month
    const startDate = new Date(selectedYear.value, selectedMonth.value, 1)
    const endDate = new Date(selectedYear.value, selectedMonth.value + 1, 0)
    
    // First, get all budgets for the selected period
    const { data: budgetsData, error: budgetsErr } = await client
      .from('budgets')
      .select('*')
      .eq('user_id', user.value.id)
      .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()},and(start_date.lte.${endDate.toISOString()},end_date.is.null)`)
    
    if (budgetsErr) throw budgetsErr
    
    if (!budgetsData || budgetsData.length === 0) {
      budgets.value = []
      return
    }
    
    // Get all budget IDs to fetch their tags
    const budgetIds = budgetsData.map(budget => budget.id)
    
    // Fetch all tags for these budgets using the junction table
    const { data: budgetTagsData, error: tagsErr } = await client
      .from('budget_tags')
      .select(`
        budget_id,
        tags:tag_id(id, name, color)
      `)
      .in('budget_id', budgetIds)
    
    if (tagsErr) throw tagsErr
    
    // Create a map of budget ID to tags array
    const budgetTagsMap = {}
    budgetTagsData?.forEach(item => {
      if (!budgetTagsMap[item.budget_id]) {
        budgetTagsMap[item.budget_id] = []
      }
      if (item.tags) {
        budgetTagsMap[item.budget_id].push(item.tags)
      }
    })
    
    // Combine budget data with tags
    budgets.value = budgetsData.map(budget => ({
      ...budget,
      tags: budgetTagsMap[budget.id] || []
    }))
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

async function fetchTags() {
  if (!user.value) return
  
  try {
    const { data, error: err } = await client
      .from('tags')
      .select('*')
      .eq('user_id', user.value.id)
    
    if (err) throw err
    
    tags.value = data || []
  } catch (err: any) {
    console.error('Error fetching tags:', err)
  }
}

async function createTag(name: string) {
  if (!user.value || !name.trim()) return null
  
  isCreatingTag.value = true
  
  try {
    const { data, error: err } = await client
      .from('tags')
      .insert({
        name: name.trim(),
        user_id: user.value.id
      })
      .select()
      .single()
    
    if (err) throw err
    
    // Add to local tags list
    const newTag = data as Tag
    tags.value.push(newTag)
    return newTag
  } catch (err: any) {
    console.error('Error creating tag:', err)
    return null
  } finally {
    isCreatingTag.value = false
  }
}

async function saveBudget() {
  if (!user.value || !newItem.name || newItem.amount <= 0) return
  
  isLoading.value = true
  
  try {
    // Calculate start date for the selected month
    const startDate = new Date(selectedYear.value, selectedMonth.value, 1)
    
    // Prepare tag IDs for the junction table
    const tagIds = newItem.tags.map(t => typeof t === 'object' && t.id ? t.id : t).filter(Boolean)
    
    // Create the budget without tags first
    const budgetData = {
      name: newItem.name,
      amount: newItem.amount,
      currency_code: newItem.currency_code,
      period: newItem.period,
      start_date: startDate.toISOString(),
      is_one_time_purchase: newItem.is_one_time_purchase,
      user_id: user.value.id
    }
    
    const { data, error: err } = await client
      .from('budgets')
      .insert(budgetData)
      .select()
      .single()
    
    if (err) throw err
    
    // Now insert the tags into the junction table if we have tags
    if (tagIds.length > 0) {
      const budgetId = data.id
      const budgetTagsData = tagIds.map(tagId => ({
        budget_id: budgetId,
        tag_id: tagId
      }))
      
      const { error: tagErr } = await client
        .from('budget_tags')
        .insert(budgetTagsData)
      
      if (tagErr) throw tagErr
    }
    
    // Reset form and refresh list
    newItem.name = ''
    newItem.amount = 0
    newItem.tags = []
    newItem.is_one_time_purchase = false
    await fetchBudgets()
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function handleTagSelect(value: any, isEditMode = false) {
  if (typeof value === 'string' && value.trim()) {
    // This is a new tag being created
    handleTagCreate(value, isEditMode)
  } else if (value && typeof value === 'object' && 'id' in value) {
    // This is an existing tag being selected - add to tags if not already there
    if (isEditMode) {
      if (!editItem.tags.some(t => t.id === value.id)) {
        editItem.tags.push(value)
      }
    } else {
      if (!newItem.tags.some(t => t.id === value.id)) {
        newItem.tags.push(value)
      }
    }
  }
  tagsQuery.value = ''
}

async function handleTagCreate(tagName?: string, isEditMode = false) {
  const name = tagName || tagsQuery.value
  if (!name.trim()) return
  
  const newTag = await createTag(name)
  if (newTag) {
    if (isEditMode) {
      if (!editItem.tags.some(t => t.id === newTag.id)) {
        editItem.tags.push(newTag)
      }
    } else {
      if (!newItem.tags.some(t => t.id === newTag.id)) {
        newItem.tags.push(newTag)
      }
    }
    tagsQuery.value = ''
  }
}

function removeTag(tagId: string, isEditMode = false) {
  if (isEditMode) {
    editItem.tags = editItem.tags.filter(t => t.id !== tagId)
  } else {
    newItem.tags = newItem.tags.filter(t => t.id !== tagId)
  }
}

// Edit mode functions
function startEditing(item: Budget) {
  editingItemId.value = item.id
  
  // Copy item data to editItem
  editItem.id = item.id
  editItem.name = item.name
  editItem.amount = item.amount
  editItem.currency_code = item.currency_code
  editItem.tags = [...item.tags]
  editItem.period = item.period
  editItem.is_one_time_purchase = item.is_one_time_purchase
}

function cancelEditing() {
  editingItemId.value = null
}

async function saveEditedBudget() {
  if (!user.value || !editItem.name || editItem.amount <= 0) return
  
  isLoading.value = true
  
  try {
    // Prepare tag IDs for the junction table
    const tagIds = editItem.tags.map(t => typeof t === 'object' && t.id ? t.id : t).filter(Boolean)
    
    // Update the budget without tags first
    const budgetData = {
      name: editItem.name,
      amount: editItem.amount,
      currency_code: editItem.currency_code,
      period: editItem.period,
      is_one_time_purchase: editItem.is_one_time_purchase,
    }
    
    // Update the budget
    const { error: updateError } = await client
      .from('budgets')
      .update(budgetData)
      .eq('id', editItem.id)
      .eq('user_id', user.value.id)
    
    if (updateError) throw updateError
    
    // Delete existing tag associations
    const { error: deleteError } = await client
      .from('budget_tags')
      .delete()
      .eq('budget_id', editItem.id)
    
    if (deleteError) throw deleteError
    
    // Insert new tag associations if there are any tags
    if (tagIds.length > 0) {
      const tagAssociations = tagIds.map(tagId => ({
        budget_id: editItem.id,
        tag_id: tagId
      }))
      
      const { error: insertError } = await client
        .from('budget_tags')
        .insert(tagAssociations)
      
      if (insertError) throw insertError
    }
    
    // Refresh budgets
    await fetchBudgets()
    
    // Reset edit mode
    editingItemId.value = null
  } catch (err: any) {
    error.value = err.message
    console.error('Error updating budget:', err)
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch([selectedMonth, selectedYear], () => {
  fetchBudgets()
  // Cancel editing when changing month/year
  editingItemId.value = null
})

// Lifecycle hooks
onMounted(() => {
  fetchTags()
  fetchBudgets()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Budget</h1>
    
    <!-- Month and Year selector -->
    <div class="flex gap-4 mb-6">
      <div class="w-32">
        <Label for="month-select">Month</Label>
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="months[selectedMonth]" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(month, index) in months" :key="index" :value="index">
              {{ month }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div class="w-32">
        <Label for="year-select">Year</Label>
        <Select v-model="selectedYear">
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="selectedYear.toString()" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="year in years" :key="year" :value="year">
              {{ year }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <!-- Budget Items List -->
    <div class="grid grid-cols-2 gap-4" style="grid-template-columns: 3fr 2fr;">
      <Card>
        <CardHeader>
          <CardTitle>Budgets</CardTitle>
          <CardDescription>
            {{ months[selectedMonth] }} {{ selectedYear }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="text-center py-4">
            Loading...
          </div>
          
          <div v-else-if="error" class="text-red-500 py-4">
            {{ error }}
          </div>
          
          <!-- <div v-else-if="budgets.length === 0" class="text-center py-4 text-gray-500">
            No budgets found for this month.
          </div> -->
          
          <div v-else class="space-y-4">
            
            
            <!-- New Item Row -->
            <Card class="bg-muted/50">
              <CardContent class="pt-6">
                <div class="grid grid-cols-6 gap-4">
                  <div>
                    <form @submit.prevent="saveBudget" class="flex items-center space-x-2">
                      <Input 
                        v-model="newItem.name" 
                        type="text" 
                        placeholder="Item name" 
                        class="w-full"
                        required
                      />
                    </form>
                  </div>
                  <div>
                    <Input 
                      v-model="newItem.amount" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0.00" 
                      class="w-full"
                      required
                    />
                  </div>
                  <div>
                    <Select v-model="newItem.currency_code">
                      <SelectTrigger class="w-full">
                        <SelectValue :placeholder="newItem.currency_code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="currency in CURRENCIES" :key="currency.value" :value="currency.value">
                          {{ currency.label }} ({{ currency.symbol }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div class="space-y-2">
                      <Combobox 
                        :ignore-filter="true" 
                        v-model:open="openTagsCombobox"
                      >
                        <ComboboxAnchor as-child>
                          <TagsInput v-model="newItem.tags" class="px-2 gap-2 w-full">
                            <div class="flex gap-2 flex-wrap items-center">
                              <TagsInputItem 
                                v-for="tag in newItem.tags" 
                                :key="tag.id" 
                                :value="tag.name"
                              >
                                <TagsInputItemText />
                                <TagsInputItemDelete @click="removeTag(tag.id)" />
                              </TagsInputItem>
                            </div>

                            <ComboboxInput v-model="tagsQuery" as-child>
                              <TagsInputInput 
                                placeholder="Search or add tags..." 
                                class="min-w-[120px] w-full p-0 border-none focus-visible:ring-0 h-auto" 
                                @keydown.enter.prevent="tagsQuery.trim() && handleTagCreate()"
                              />
                            </ComboboxInput>
                          </TagsInput>

                          <ComboboxList class="w-[--reka-popper-anchor-width]">
                            <ComboboxEmpty v-if="filteredTags.length === 0 && tagsQuery.trim()">
                              <div class="p-2 text-sm">
                                No tags found. Press Enter to create "{{ tagsQuery }}"
                              </div>
                            </ComboboxEmpty>
                            <ComboboxGroup>
                              <ComboboxItem
                                v-for="tag in filteredTags" 
                                :key="tag.id" 
                                :value="tag"
                                @select.prevent="(ev) => {
                                  handleTagSelect(ev.detail.value)
                                  
                                  if (filteredTags.length === 0) {
                                    openTagsCombobox = false
                                  }
                                }"
                              >
                                {{ tag.name }}
                              </ComboboxItem>
                            </ComboboxGroup>
                          </ComboboxList>
                        </ComboboxAnchor>
                      </Combobox>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center space-x-2">
                      <Checkbox 
                        id="is-one-time" 
                        v-model="newItem.is_one_time_purchase" 
                      />
                      <Label for="is-one-time" class="text-sm">One-time purchase</Label>
                    </div>
                  </div>
                  <div>
                    <Button 
                      type="submit" 
                      size="sm" 
                      :disabled="isLoading || !newItem.name || newItem.amount <= 0"
                      @click.prevent="saveBudget()"
                    >
                      {{ isLoading ? 'Saving...' : 'Add' }}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <!-- Existing Items -->
            <Card 
              v-for="item in budgets" 
              :key="item.id" 
              class="hover:bg-accent/5 transition-colors"
              :class="{ 'border-primary': editingItemId === item.id }"
            >
              <CardContent class="pt-6">
                <!-- View Mode -->
                <div v-if="editingItemId !== item.id" class="grid grid-cols-6 gap-4">
                  <div class="font-medium">{{ item.name }}</div>
                  <div>{{ item.amount.toFixed(2) }}</div>
                  <div>
                    {{ CURRENCIES.find(c => c.value === item.currency_code)?.symbol || item.currency_code }}
                    <span v-if="item.is_one_time_purchase" class="ml-1 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm">One-time</span>
                  </div>
                  <div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="tag in item.tags" 
                        :key="tag.id" 
                        class="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded-md"
                      >
                        {{ tag.name }}
                      </span>
                    </div>
                  </div>
                  <div></div>
                  <div class="flex space-x-2">
                    <Button variant="outline" size="sm" @click="startEditing(item)">Edit</Button>
                  </div>
                </div>
                
                <!-- Edit Mode -->
                <div v-else-if="editingItemId === item.id" class="grid grid-cols-6 gap-4">
                  <div>
                    <Input 
                      v-model="editItem.name" 
                      type="text" 
                      placeholder="Item name" 
                      class="w-full"
                      required
                    />
                  </div>
                  <div>
                    <Input 
                      v-model="editItem.amount" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0.00" 
                      class="w-full"
                      required
                    />
                  </div>
                  <div>
                    <Select v-model="editItem.currency_code">
                      <SelectTrigger class="w-full">
                        <SelectValue :placeholder="editItem.currency_code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="currency in CURRENCIES" :key="currency.value" :value="currency.value">
                          {{ currency.label }} ({{ currency.symbol }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div class="space-y-2">
                      <Combobox 
                        :ignore-filter="true" 
                      >
                        <ComboboxAnchor as-child>
                          <TagsInput v-model="editItem.tags" class="px-2 gap-2 w-full">
                            <div class="flex gap-2 flex-wrap items-center">
                              <TagsInputItem 
                                v-for="tag in editItem.tags" 
                                :key="tag.id" 
                                :value="tag.name"
                              >
                                <TagsInputItemText />
                                <TagsInputItemDelete @click="removeTag(tag.id, true)" />
                              </TagsInputItem>
                            </div>

                            <ComboboxInput v-model="tagsQuery" as-child>
                              <TagsInputInput 
                                placeholder="Search or add tags..." 
                                class="min-w-[120px] w-full p-0 border-none focus-visible:ring-0 h-auto" 
                                @keydown.enter.prevent="tagsQuery.trim() && handleTagCreate(undefined, true)"
                              />
                            </ComboboxInput>
                          </TagsInput>

                          <ComboboxList class="w-[--reka-popper-anchor-width]">
                            <ComboboxEmpty v-if="filteredTags.length === 0 && tagsQuery.trim()">
                              <div class="p-2 text-sm">
                                No tags found. Press Enter to create "{{ tagsQuery }}"
                              </div>
                            </ComboboxEmpty>
                            <ComboboxGroup>
                              <ComboboxItem
                                v-for="tag in filteredTags" 
                                :key="tag.id" 
                                :value="tag"
                                @select.prevent="(ev) => handleTagSelect(ev.detail.value, true)"
                              >
                                {{ tag.name }}
                              </ComboboxItem>
                            </ComboboxGroup>
                          </ComboboxList>
                        </ComboboxAnchor>
                      </Combobox>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center space-x-2">
                      <Checkbox 
                        id="edit-is-one-time" 
                        v-model="editItem.is_one_time_purchase" 
                      />
                      <Label for="edit-is-one-time" class="text-sm">One-time purchase</Label>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <Button 
                      type="submit" 
                      size="sm" 
                      variant="default"
                      :disabled="isLoading || !editItem.name || editItem.amount <= 0"
                      @click="saveEditedBudget()"
                    >
                      {{ isLoading ? 'Saving...' : 'Save' }}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      @click="cancelEditing()"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <!-- Empty State -->
            <div v-if="budgets.length === 0" class="text-center py-8 text-muted-foreground">
              No budget items found for this month. Add your first item above.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budgets</CardTitle>
          <CardDescription>
            Period info
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WidgetsBudgetInfo :budgets="budgets" :tags="tags" />
          
          


          <!-- budget sum info -->
        </CardContent>
      </Card>
     </div>
    
  </div>
</template>
