<template>
    <component :is="type" :class="{
        ...(pre ? {'white-space': 'pre-wrap', height: 'auto'} : {}),
        comment: true,
        'hidden-comment': !(sharedState.showComments || isPresenter),
        'presenter-comment': isPresenter,
    }"><slot /></component>
</template>
<script lang="ts" setup>
import { sharedState } from '@slidev/client/state/shared.ts'
import { isPresenter } from '@slidev/client/logic/nav.ts'

const props = defineProps({
    type: { default: "span"},
    pre: { default: false},
})

</script>
<style>
.comment {
    background: rgba(255, 255, 128, 0.7);
    color: darkred;

    box-sizing: border-box;
    border-radius: 3px;

    font-size: 14px;
    /*line-height: initial;*/
    padding: 1px 15px;
    height: 20px;
    width: auto;
    /*margin-left: 100px;*/
    margin-top: -6.6px;
    margin-bottom: -13.2px;

    --hidecomment-duration: 150ms;
    --showcomment-duration: 450ms;

    transition: opacity var(--hidecomment-duration) ease, display 0ms;
}
.dark .comment {
    filter: invert();
}
.hidden-comment {
    display: none;
    opacity: 0;
    transition: opacity var(--showcomment-duration) ease, display 0s ease var(--showcomment-duration);
}
.presenter-comment {
    border: 1px solid red;
    color: yellow;
    background: black;
    transition: all 0s;
}
</style>
    