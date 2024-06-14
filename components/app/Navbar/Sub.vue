<script setup lang="ts">
import type {MenuItem} from "~/interfaces"
import {AppNavbarItem, AppNavbarSub, MenubarItem, MenubarSeparator, MenubarSub} from "#components"

defineProps<{ item: MenuItem }>()
</script>

<template>
  <MenubarSubTrigger>{{ item.name }}</MenubarSubTrigger>
  <MenubarSubContent>
    <component
        v-for="sub in item.sub_items" :key="sub.name" @click="sub.action"
        :is="sub.is_separator? MenubarSeparator : (sub.sub_items ? MenubarSub : MenubarItem)">
      <component :is="sub.sub_items ? AppNavbarSub : AppNavbarItem" :item="sub"/>
    </component>
  </MenubarSubContent>
</template>

<style scoped>

</style>