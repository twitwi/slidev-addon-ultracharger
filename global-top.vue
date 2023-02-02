<template>
  <footer
    v-if="has('metaFooter') && ($slidev.nav.currentLayout !== 'cover')"
    class="absolute bottom-0 text-center left-0 right-0 px-2 py-0 text-xs"
      >
      <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="icon-btn opacity-20 !border-none !hover:text-white p-0">
          <carbon:edit />
      </button>
      {{ (conf('metaFooter') ?? "date author morefooter").split(" ").map(k => $slidev.configs[k]).filter(v => !!v).join(" − ") }}
      −
      {{ $slidev.nav.currentPage }} / {{ slideCount }}
  </footer>
  <footer>
    <!--AutoPlay /-->
    <TocNG v-if="has('tocFooter')" mode="allDots" :max-depth="1" class="absolute bottom-0 right-5" />
    <Blackout v-if="has('blackout')" />
  </footer>
  <!--TOC mode="dots" class="absolute bottom-0 right-5" /-->
</template>
<script setup lang="ts">
import { computed } from 'vue';

const conf = (k) => $slidev.configs.addonsConfig?.ultracharger?.[k]
const has = (feat) => !conf('disable')?.includes(feat)

const fakeEnds = computed(() => {
  const trueEnd = $slidev.nav.total
  let endParam = conf('fakeEnd') ?? ''
  if (endParam === '') {
    return [trueEnd]
  }
  if (typeof endParam === 'number') {
    endParam = [endParam]
  }
  if (typeof endParam === 'string') {
    endParam = endParam.split(' ').map(s => parseInt(s))
  }
  endParam = endParam.map(i => i < 0 ? trueEnd + i : i)
  endParam.push(trueEnd)
  endParam.sort((a, b) => a - b)
  return endParam
})
const slideCount = computed(() => fakeEnds.value.find(e => e >= $slidev.nav.currentPage))
</script>
