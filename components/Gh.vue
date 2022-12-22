<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'

const inst = getCurrentInstance()

const props = defineProps({
    href: { default: ""},
    prefix: { default: undefined },
    line: { default: undefined},
})
const possibleHash = computed(() => props.line ? '#L'+props.line : '')
const prefix = computed(() => props.prefix ?? $slidev.configs.ghPrefix ?? './')
</script>
<template>
    <a :href="prefix + href + possibleHash" target="_blank" class="gh-link"><code>{{ href }}</code></a>
</template> 
