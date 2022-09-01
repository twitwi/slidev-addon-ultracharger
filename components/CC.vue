<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'
//import {} from '@slidev/client/constants'
import { currentPage } from '@slidev/client/logic/nav'

const props = defineProps({
    eid: {default: undefined},
    toc: {default: 'toc'},
    dotStyle: {default: undefined },
})
const inst = getCurrentInstance()
const vnodes = inst.slots.default?.()
let jumpTo = +inst.parent.attrs?.class?.replace(/.*-/, '')
if (isNaN(jumpTo)) {
    jumpTo = +inst.parent.parent.attrs?.class?.replace(/.*-/, '')
}
window.TOCs?.[props.toc]?.add({eid: props.eid, vnodes, jumpTo, dotStyle: props.dotStyle})
</script>
<template>
    <slot/>
</template>