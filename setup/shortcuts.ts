import { defineShortcutsSetup, NavOperations } from '@slidev/types'
import { sharedState } from "@slidev/client/state/shared";
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
          (<any>sharedState).blackout = !((<any>sharedState).blackout ?? false);
        }
      },
    },

    /* FEATURE toggle view comments */
    {
      key: "v",
      fn: () => {
        (<any>sharedState).showComments = !((<any>sharedState).showComments ?? false);
      },
    },
  ]
})