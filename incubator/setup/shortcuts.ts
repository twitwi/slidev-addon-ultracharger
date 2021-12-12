import { defineShortcutsSetup, NavOperations } from '@slidev/types'
import { serverState } from "@slidev/client/env";
import { isPresenter, clicks, clicksTotal, currentPage, prevSlide, nextSlide, go } from '@slidev/client/logic/nav'
export default defineShortcutsSetup((nav: NavOperations) => {
  return [
    /* FEATURE browse slides */
    {
      key: 'z',
      fn: async () => {
        if (clicks.value === clicksTotal.value) {
          await nextSlide();
        }
        await go(currentPage.value, clicksTotal.value);
      },
      autoRepeat: true,
    },
    {
      key: 'a',
      fn: async () => {
        await prevSlide();
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
