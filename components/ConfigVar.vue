<template>
    <component :is="type" v-html="content" />
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';


const props = defineProps({
    name: { default: undefined },
    type: { default: "span"},
    nbsp: { default: " "},
})

const content = computed(() => {
    console.log(props.name)
    let v = $slidev.configs[props.name]
    v = v.replaceAll(/ /g, props.nbsp)
    return v
})
</script>
