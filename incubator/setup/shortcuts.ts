import { defineShortcutsSetup, NavOperations } from '@slidev/types'

export default defineShortcutsSetup((nav: NavOperations) => {
  return [
    {
      key: 'z',
      fn: async () => {
        const n = __slidev__.nav;
        if (n.clicks === n.clicksTotal) {
          await n.nextSlide();
        }
        await n.go(n.currentPage, n.clicksTotal);
      },
      autoRepeat: true,
    },
    {
      key: 'a',
      fn: async () => {
        const n = __slidev__.nav;
        await n.prevSlide();
      },
      autoRepeat: true,
    },
  ]
})
