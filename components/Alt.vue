<script setup>
import { ref, onMounted } from 'vue'

let altParam = $slidev?.configs?.addonsConfig?.ultracharger?.altParam ?? 'alt'
let forceAlt = $slidev?.configs?.addonsConfig?.ultracharger?.alt ?? false

const el = ref()

onMounted(() => {
    const params = new URLSearchParams(globalThis.document.location.search)
    if (forceAlt || params.has(altParam)) {
        const span = el.value
        span.parentNode.innerHTML = span.innerHTML
    }
})
</script>
<template>
    <span ref="el" class="unwrapped-or-display-none" style="display: none">
        <slot></slot>
    </span>
</template>
