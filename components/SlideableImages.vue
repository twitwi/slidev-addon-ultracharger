<script setup lang="ts">
import { ref, computed } from 'vue'


const props = defineProps({
    min: { default: 0},
    max: { default: 1},
    startAt: { default: 0},
    step: { default: 0.5},
    format: {
        default: (v: Number) => 'media/image-'+v.padStart(3, '0')+'.png',
    },
})
const current = ref(props.startAt)
const src = computed(() => props.format(current.value))
const slotProps = ref({
    current, src
})
</script>

<template>
    <div>
    <slot name="top" v-bind="slotProps"></slot>
    <input type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="current">
    <img :src="src">
    </div>
</template>

<style scoped>
    input { width: 100%; }
img { max-height: 430px; margin: auto;}
</style>
