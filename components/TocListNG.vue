<!--
TOC list
(used by TocNG component, you don't need to use this component directly)

Usage:

<TocListNG :list="list"/>
-->
<script setup lang="ts">
import type { TocItem } from '@slidev/client/logic/nav.ts'
import { router } from '@slidev/client/routes.ts'

withDefaults(defineProps<{
  level: number
  list: TocItem[]
  mode?: 'ul' | 'span'
  dots?: string
}>(), { level: 1, mode: 'ul', dots: '●○◌◡.' })
</script>

<template>
  <ul v-if="mode === 'ul' && list && list.length > 0" :class="['slidev-toc-list', `slidev-toc-list-level-${level}`]">
    <li v-for="item in list" :key="item.path" :class="['slidev-toc-item', {'slidev-toc-item-active': item.active}, {'slidev-toc-item-parent-active': item.activeParent}]">
      <Link :class="{active: item.active}" :to="item.path" v-html="item.title" />
      <TocListNG :level="level + 1" :list="item.children" />
    </li>
  </ul>
  <template v-if="mode === 'span' && list && list.length > 0">
    <template v-for="item in list" :key="item.path">
      <Link
        :class="['slidev-toc-dot', item.active ? 'slidev-toc-dot-active' : '', `slidev-toc-dot-level-${level}`]"
        :to="item.path"
      >
        {{ dots[Math.min(level, dots.length) - 1] }}
      </Link>
      <TocListNG :level="level + 1" :list="item.children" :mode="mode" :dots="dots" />
    </template>
  </template>
</template>

<style>
    .dark .slidev-toc-dot { filter: invert();}
</style>
<style scoped>
    a { cursor: pointer; border-bottom-width: 0 !important;}
    .slidev-toc-dot:hover { color: red !important; }
    .slidev-toc-dot { font-size: 0.65em; color: #444; text-shadow: white 0 0 2px; margin: 0 .05em; }
    .slidev-toc-dot-active ~ .slidev-toc-dot { color: #bbb; }
</style>
