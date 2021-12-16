<script setup lang="ts">
import Anim from '../components/Anim.vue'

const props = defineProps({
  spec: {
    type: String,
  },
})

</script>

<template>
  <div class="slidev-layout default">
    <Anim :spec="props.spec"><slot/></Anim>
  </div>
</template>

