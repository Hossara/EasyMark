<script setup lang="ts">
import type {MenuItem} from "~/interfaces"

defineProps<{ item: MenuItem }>()
</script>

<template>
  {{ item.name }} <MenubarShortcut v-if="item.command">{{ item.command }}</MenubarShortcut>
</template>