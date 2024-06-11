import { defineShortcutsSetup, NavOperations } from '@slidev/types'
import { useNav } from '@slidev/client'
const { isPresenter, clicks, clicksTotal, currentPage, prevSlide, nextSlide, go } = useNav()

import { sharedState as _state } from '@slidev/client/state/shared.ts'
const sharedState = _state as unknown as Record<"blackout"|"showComments", boolean>

export default defineShortcutsSetup((nav: NavOperations, baseShortcuts: any) => {
  return [
    ...baseShortcuts,
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
          sharedState.blackout = !(sharedState.blackout ?? false);
        }
      },
    },

    /* FEATURE toggle view comments */
    {
      key: "v",
      fn: () => {
        sharedState.showComments = !(sharedState.showComments ?? false);
      },
    },

    /* FEATURE toggle drawing */
    {
      key: "p",
      fn: () => {
        nav.toggleDrawing()
      },
    },
  ]
})
