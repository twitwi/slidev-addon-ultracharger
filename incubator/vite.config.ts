import { defineConfig } from 'vite'

export default defineConfig({
  slidev: {
    vue: {
      /* vue options */
    },
    markdown: {
      /* markdown-it options */
      markdownItSetup(md) {
        md.renderer.rules.step_marker = () => '<span class="step"></span>'
        md.inline.ruler.after('text', 'step_symbol', function replace(state) {
            let ch, code, match, pos = state.pos, max = state.posMax;

            if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }
            if (pos + 1 < max) {
                ch = state.src.charCodeAt(pos + 1);
                if (ch === 124 /* | */) {
                    state.push('step_marker')
                    //if (!silent) {
                    //}
                    state.pos += 2
                    return true
                  }
                }
            return false
        })
      }
    },
    /* options for other plugins */
  },
} as UserConfig)
