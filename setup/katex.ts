import { defineKatexSetup } from '@slidev/types'

export default defineKatexSetup(() => {
  return {
    macros: {} // have it so it get enriched by \gdef ... might not be necessary (anymore)
  }
})
