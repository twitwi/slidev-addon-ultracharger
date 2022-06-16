<template>
    <div class="controls">
        <p>
        interval:
        <input v-model="interval" type="number" placeholder="interval">
    </p>
    <button v-if="isActive" class="bg-red-400" @click="pause">
        Pause
    </button>
    <button v-if="!isActive" @click="resume">
        Resume
    </button>
  </div>
</template>
<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'
import { next, hasNext, go } from '@slidev/client/logic/nav'

const interval = ref(1000)
const { pause, resume, isActive } = useIntervalFn(() => {
    hasNext.value ? next() : go(0)
}, interval)

pause() // start paused

</script>
<style scoped>
.controls {
    background: lightgray;
    position: absolute;
    right: 0; bottom: 0;
}
.controls:not(:hover) {
    opacity: 0.1;
}
</style>
