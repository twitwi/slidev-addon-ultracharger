import { defineShortcutsSetup, NavOperations } from '@slidev/types'
import { serverState } from "@slidev/client/env";
import { isPresenter } from '@slidev/client/logic/nav'

export default defineShortcutsSetup((nav: NavOperations) => {
  return [
    /* FEATURE browse slides */
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

    /* FEATURE blackout */
    {
      key: "b",
      fn: () => {
        if (isPresenter.value) {
          (<any>serverState).blackout = !((<any>serverState).blackout ?? false);
        }
      },
    },
  ]
})
