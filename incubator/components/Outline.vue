<script setup lang="ts">
import { ref, computed, getCurrentInstance, onMounted, cloneVNode } from 'vue'

function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode)
    if (Array.isArray(vnode.children)) {
        cloned.children = vnode.children.map(deepCloneVNode)
    }
    return cloned
}

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
    window.OUTLINES[props.name] = slot
    ivn.value = slot.map(deepCloneVNode) // if we use directly the slot, we get problems with built versions
} else {
    let injectVNodes = () => {
        let nodes = []
        if (props.name in window.OUTLINES) {
            nodes = window.OUTLINES[props.name].map(vn => deepCloneVNode(vn))
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
                    hl = hl.props ?? {}
                    hl.class = hl.class ? hl.class+' highlight' : 'highlight'
                    nodes[0].children[current.value].props = hl
                }
            }
        }
        return nodes
    }
    onMounted(() => {ivn.value = injectVNodes()})
}


const RenderVNodes = (props, context) => props.vnodes
</script>

<template>
    <div class="outline">
        <RenderVNodes :vnodes="ivn"></RenderVNodes>
    </div>
</template>

