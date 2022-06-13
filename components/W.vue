<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'

const props = defineProps({
    href: { default: ""},
})
const inst = getCurrentInstance()
let t = inst.slots.default?.()
const url = computed(() => {
    if (props.href !== "") {
        return `https://en.wikipedia.org/wiki/${props.href}`
    }
    return `https://en.wikipedia.org/wiki/${t?.[0].children}`
})
</script>
<template>
    <slot></slot>
    <a :href="url" target="_blank" class="wikipedia-link">W</a>
</template> 