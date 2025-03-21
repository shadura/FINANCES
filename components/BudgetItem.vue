<script setup lang="ts">
import { ref } from 'vue'
import { CURRENCIES } from '~/lib/constants/currencies'
import { useFilter } from 'reka-ui'

// Props
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

const props = defineProps<{
  item: Budget
  isEditing: boolean
  editItem: {
    id: string
    name: string
    amount: number
    currency_code: string
    tags: Tag[]
    period: string
    is_one_time_purchase: boolean
  }
  filteredTags: Tag[]
  isLoading: boolean
  tagsQuery: string
}>()

const emit = defineEmits<{
  'start-editing': [item: Budget]
  'cancel-editing': []
  'save-edited-budget': []
  'handle-tag-select': [value: any, isEditMode: boolean]
  'handle-tag-create': [tagName: string | undefined, isEditMode: boolean]
  'remove-tag': [tagId: string, isEditMode: boolean]
  'update:tagsQuery': [value: string]
}>()

// Computed
const { contains } = useFilter({ sensitivity: 'base' })

// Methods
function onTagsQueryUpdate(value: string) {
  emit('update:tagsQuery', value)
}
</script>

<template>
  <Card 
    class="hover:bg-accent/5 transition-colors"
    :class="{ 'border-primary': isEditing }"
  >
    <CardContent class="pt-6">
      <!-- View Mode -->
      <div v-if="!isEditing" class="grid grid-cols-6 gap-4">
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
          <Button variant="outline" size="sm" @click="emit('start-editing', item)">Edit</Button>
        </div>
      </div>
      
      <!-- Edit Mode -->
      <div v-else class="grid grid-cols-6 gap-4">
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
                      <TagsInputItemDelete @click="emit('remove-tag', tag.id, true)" />
                    </TagsInputItem>
                  </div>

                  <ComboboxInput v-model="tagsQuery" as-child>
                    <TagsInputInput 
                      placeholder="Search or add tags..." 
                      class="min-w-[120px] w-full p-0 border-none focus-visible:ring-0 h-auto" 
                      @keydown.enter.prevent="tagsQuery.trim() && emit('handle-tag-create', tagsQuery, true)"
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
                      @select.prevent="(ev) => emit('handle-tag-select', ev.detail.value, true)"
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
            @click="emit('save-edited-budget')"
          >
            {{ isLoading ? 'Saving...' : 'Save' }}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            @click="emit('cancel-editing')"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
