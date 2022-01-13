<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'

const inst = getCurrentInstance()

const props = defineProps({
    href: { default: ""},
    line: { default: undefined},
})
const possibleHash = computed(() => props.line ? '#L'+props.line : '')
// how could we access this $slidev.configs here?
</script>
<template>
    <a :href="$slidev.configs.ghPrefix + href + possibleHash" target="_blank" class="gh-link"><code>{{ href }}</code></a>
</template> 
