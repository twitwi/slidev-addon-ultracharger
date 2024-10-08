import { defineKatexSetup } from '@slidev/types'

export default defineKatexSetup(() => {
    return {
        macros: {},
        throwOnError: false,
        trust: true, // allow \htmlClass{cls}{tex}
    }
})
