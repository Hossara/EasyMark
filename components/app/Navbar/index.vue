<script setup lang="ts">
import {AppNavbarItem, AppNavbarSub, MenubarItem, MenubarSeparator, MenubarSub} from "#components"
import type {MenuItem} from "~/interfaces"

const menu = shallowRef([
  {
    name: "File",
    sub_items: [
      {name: "New file"},
      {name: "Open file"}
    ]
  },
  {name: "Settings"},
  {name: "Help"},
  {name: "About"}
] as MenuItem[])
</script>

<template>
  <Menubar>
    <MenubarMenu v-for="item in menu" :key="item.name">
      <MenubarTrigger>{{ item.name }}</MenubarTrigger>

      <MenubarContent v-if="item.sub_items">
        <component
            v-for="sub in item.sub_items"
            :key="sub.name" :is="sub.is_separator? MenubarSeparator : (sub.sub_items ? MenubarSub : MenubarItem)"
            @click="sub.action">
          <component :is="sub.sub_items ? AppNavbarSub : AppNavbarItem" :item="sub"/>
        </component>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>