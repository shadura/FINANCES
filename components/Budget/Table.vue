<script setup lang="ts">

const data = [
  {
    name: 'Cafe',
    account: 'Mono White',
    tags: ['Tag 1', 'Tag 2'],
    currency: 'UAH',
    amount: 250.00
  }
]


</script>

<template>
  <div class="grid grid-cols-2 gap-4" style="grid-template-columns: 3fr 2fr;">
    <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[50px]">
          
        </TableHead>
        <TableHead>
          Name
        </TableHead>
        <TableHead>Tags</TableHead>
        <TableHead class="text-right">
          Amount
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="item in data" :key="item.name">
        <TableCell class="text-center">
          <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost">
        <Icon name="material-symbols:more_vert" />
      </Button>
    </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuItem>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-red-500">
            <span> Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </TableCell>
        <TableCell class="font-medium">
          {{ item.name }}
        </TableCell>
        <TableCell>
          <span class="flex flex-wrap gap-1">
            <span v-for="(tag, index) in item.tags" :key="index" class="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded-md">
              {{ tag }}
            </span>
          </span>
        </TableCell>
        <TableCell class="text-right">
          {{ item.amount }} {{ item.currency }}
        </TableCell>
        
      </TableRow>
    </TableBody>
    </Table>
    <div>Info</div>
  </div>
</template>