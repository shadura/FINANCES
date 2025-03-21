<script setup lang="ts">
interface Tag {
  id: string;
  name: string;
}

interface Budget {
  id: string;
  amount: number;
  tags: Tag[];
  [key: string]: any;
}

const props = defineProps<{
  budgets: Budget[];
  tags: Tag[];
}>();

const sum = computed(() => props.budgets.reduce((prev, curr) => prev + curr.amount, 0))

const getItemInfo = (tag: Tag) => computed(() => {
  const items = props.budgets.filter(b => b.tags.some(t => t.id === tag.id))
  const percentage = (items.reduce((prev, curr) => prev + curr.amount, 0) / sum.value) * 100
  
  return {
    amount: items.reduce((prev, curr) => prev + curr.amount, 0),
    percentage: Math.round(percentage * 100) / 100
  }
})
</script>

<template>
  <div>
    <div class="text-center font-bold text-2xl">
      {{ sum }} USD
    </div>
    <ul class="list-inside list-disc space-y-1 mt-8">
      <li v-for="tag in tags.sort((a, b) => props.budgets.filter(b => b.tags.some(t => t.id === b.id)).reduce((prev, curr) => prev + curr.amount, 0) - props.budgets.filter(b => b.tags.some(t => t.id === a.id)).reduce((prev, curr) => prev + curr.amount, 0))" :key="tag.id" class="flex items-center space-x-2 justify-between">
        <span class="text-sm">{{ tag.name }}</span>
        <span class="text-sm font-bold">
          {{ getItemInfo(tag).value.amount }} USD 
          ({{ getItemInfo(tag).value.percentage }}%)
        </span>
      </li>
    </ul>
  </div>
</template>


