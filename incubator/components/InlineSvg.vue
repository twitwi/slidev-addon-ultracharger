<script lang="ts">
import { h, ref, inject, nextTick } from "vue";

export default {
  props: {
    src: { default: "" },
    wrap: { default: undefined },
    width: { default: undefined },
    height: { default: undefined },
  },
  setup(props) {
    // Ancestor components are free to inject a ref<callback> to know when this is rendered.
    const notifyAsyncDone = inject(
      "notifyAsyncDone",
      ref(() => {})
    );
    const rawSvg = ref("");
    (async function () {
      //console.log(import.meta.env.BASE_URL, props.src.replace(/^\//, ''))
      let req = await fetch(import.meta.env.BASE_URL + props.src.replace(/^\//, ''))
      rawSvg.value = await req.text()
      /*
      TODO: this might be useful if we manage to make it inlined for single-file release
      rawSvg.value = (
        await import(props.src + "?raw")
      ).default;
      */
    })();
    return () => {
      nextTick(() => {

        notifyAsyncDone.value()
      });
      let patchedSVG = rawSvg.value
      patchedSVG = patchedSVG.replace(/<svg[ \n]/, '<svg'+(props.width ? ` width="${props.width}"` : '')+(props.height ? ` height="${props.height}"` : '')+' ')
      // ok-ish to not remove the exsting width/height https://stackoverflow.com/questions/26341507/can-an-html-element-have-the-same-attribute-twice#comment110233733_26341866
      return h("div", { [props.wrap === undefined ? 'outerHTML' : 'innerHTML']: patchedSVG, width: props.width, height: props.height });
    };
  },
};
</script>
