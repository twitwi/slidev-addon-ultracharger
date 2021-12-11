<script setup lang="ts">
import { ref, computed, getCurrentInstance, onMounted } from 'vue'

const props = defineProps({
    current: { default: 999999},
    use: {default: null},
    base: {default: 1}, // TODO a default base should be saved in OUTLINES 
    name: {default: 'outline'},
})
const current = computed(() => props.current - props.base)
const ivn = ref([])

// TODO: best place to store this clonable vnode
window.OUTLINES = window.OUTLINES ?? {}
const inst = getCurrentInstance()
let slot = inst.slots.default?.()

if (slot !== undefined) {
    window.OUTLINES[props.name] = JSON.stringify(slot)
} else {
    let injectVNodes = () => {
        let nodes = []
        if (props.name in window.OUTLINES) {
            nodes = JSON.parse(window.OUTLINES[props.name])
            if (props.use !== null) {
                // use
                nodes = nodes[0]?.children?.[props.use - props.base]
                if (nodes.type === 'li') {
                    nodes = nodes.children
                }
            } else {
                // potential current
                let hl = nodes[0]?.children?.[current.value]
                if (hl !== undefined) {
                    hl.props = hl.props ?? {}
                    hl = hl.props
                    hl.class = hl.class ? hl.class+' highlight' : 'highlight'
                }
            }
        }

        return nodes
    }
    onMounted(() => {ivn.value = injectVNodes()})
}


const RenderVNodes = (props, context) => props.vnodes
const slotProps = {}
</script>

<template>
    <div class="outline">
        <slot v-bind="slotProps"></slot>
        <RenderVNodes :vnodes="ivn"></RenderVNodes>
    </div>
</template>

