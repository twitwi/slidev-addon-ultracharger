import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  slidev: {
    vue: {
      template: {
        transformAssetUrls: {
          // defaults...
          video: ["src", "poster"],
          source: ["src"],
          img: ["src"],
          image: ["xlink:href", "href"],
          use: ["xlink:href", "href"],
          // custom ones, allow InlineSvg src="..." to be bundled at build time
          InlineSvg: ["src"],
          ["inline-svg"]: ['src'],
        },
      },
    },
    markdown: {
      /* markdown-it options */
      markdownItSetup(md) {
        md.renderer.rules.step_marker = () => '<span class="step"></span>';
        md.inline.ruler.after("text", "step_symbol", function replace(state) {
          let ch,
            code,
            match,
            pos = state.pos,
            max = state.posMax;

          if (state.src.charCodeAt(pos) !== 0x26 /* & */) {
            return false;
          }
          if (pos + 1 < max) {
            ch = state.src.charCodeAt(pos + 1);
            if (ch === 124 /* | */) {
              state.push("step_marker");
              //if (!silent) {
              //}
              state.pos += 2;
              return true;
            }
          }
          return false;
        });
      },
    },
    /* options for other plugins */
  },
} as UserConfig);
