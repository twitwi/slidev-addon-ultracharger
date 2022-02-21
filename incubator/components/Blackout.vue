<template>
  <div
    :style="slideHeightAsVariable"
    :class="{
      blackout: true,
      'hidden-blackout': !(serverState.blackout && !isPresenter),
      'presenter-blackout': serverState.blackout && isPresenter,
    }"
  >Blacked out</div>
</template>
<script lang="ts" setup>
import { serverState, slideHeight } from '@slidev/client/env'
import { isPresenter } from '@slidev/client/logic/nav'
// avoid type checking...
let slideHeightAsVariable = {}
slideHeightAsVariable['--slide-height'] = slideHeight + 'px'
</script>
<style scoped>
.blackout {
  background: black;
  color: black; /* text not visible */
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  --blackout-duration: 150ms;
  --unblackout-duration: 450ms;
  transition: opacity var(--blackout-duration) ease, visibility 0ms;
}
.dark .blackout {
  filter: invert();
}
.hidden-blackout {
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--unblackout-duration) ease, visibility 0s ease var(--unblackout-duration);
}
.presenter-blackout {
  opacity: .75;
  visibility: visible;
  border-bottom: .1em solid white;
  color: chartreuse;
  font-size: 30px;
  top: auto;
  height: 1.6em;
  left: 1.6em;
  text-align: center;
  width: var(--slide-height);/*100px; /* replaced by vue above */
  transform-origin: 0 100%;
  transform: rotate(-90deg);
  transition: all 0s;
}
</style>
