<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref, watchEffect, provide, reactive } from 'vue'
import { currentPage, go } from '@slidev/client/logic/nav'


async function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

const props = defineProps({
  id: {
    type: String,
    default: 'toc',
  },
  mode: {
      type: String,
      default: 'list',
  },
})

window.TOCs = window.TOCs || {}
window.TOCs[props.id] = window.TOCs[props.id] || {}
window.TOCs[props.id].toc = window.TOCs[props.id].toc || reactive([])
const toc = window.TOCs[props.id].toc
window.TOCs[props.id].add = async desc => {
    const toc = window.TOCs[props.id].toc
    if (desc.eid === undefined) {
        desc.eid = '--auto-' + await hash(JSON.stringify(desc.vnodes).replace(/"el":(null|\{\})/g, ''))
    }
    //console.log(toc.map(t=>t.jumpTo))
    for (const t of toc) {
        if (t.eid === desc.eid) {
            Object.assign(t, desc)
            return
        }
    }
    toc.push(desc)
    toc.sort((a,b) => Math.sign(a.jumpTo - b.jumpTo))
}

const RenderVNodes = (props, context) => props.vnodes
const click = t => {
    go(t.jumpTo)
}
</script>
<template>
    <div>
        <ul v-if="props.mode === 'list'">
            <li v-for="t in toc" :key="t.eid">
                <a @click="click(t)"><RenderVNodes :vnodes="t.vnodes"/></a>
            </li>
        </ul>
        <span v-if="props.mode === 'dots'">
            <a v-for="t in toc" :key="t.eid" @click="click(t)" :title="t.vnodes?.[0]?.children"
            :class="{dot: true, future: t.jumpTo > currentPage}" :style="t.dotStyle">●</a>
        </span>
    </div>
</template>
<style>
    a { cursor: pointer; }
    .dark .dot { filter: invert();}
    .dot { font-size: 0.65em; color: #444; text-shadow: white 0 0 2px; margin: 0 .05em; }
    .future { color: #bbb; opacity: .5; }
</style>
