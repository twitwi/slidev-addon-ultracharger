<template>
    <span v-if="has('metaOnslide')" style="display: none" :class="{
        ['onslide-' + $nav.currentPage]: true,
        ['onslide-id-' + $nav.currentSlideId]: true,
        ['onclick-' + $nav.clicks]: true,
        ['onlayout-' + $nav.currentLayout]: true,
        ['onroute-' + $nav.currentPath]: true,
    }"></span>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const conf = (k) => $slidev.configs.addonsConfig?.ultracharger?.[k]
const has = (feat) => !conf('disable')?.includes(feat)
</script>
<!--
global-bottom comes first so this span can be used for CSS depending on slide number of click number etc...

This is especially useful to style things outside the slide (e.g. the global-top)

e.g. to slide a TOC that would be in global-top

.onslide-1 ~ * .slidev-toc {
    font-size: 8px;
}
-->

