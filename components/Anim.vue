<script setup lang="ts">
import { range, remove } from '@antfu/utils'
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref, watchEffect, provide } from 'vue'
import { injectionClicks, injectionClicksElements, injectionClicksDisabled } from '@slidev/client/constants'
import { parseRangeString } from '@slidev/parser'
import parseDuration from 'parse-duration'
import { animate } from "popmotion"
import parse from 'parse-duration'

const props = defineProps({
  spec: {
    default: () => '',
  },
  at: {
    type: Number,
    default: undefined,
  },
  dur: {
    type: String,
    default: '300ms',
  }
})
const clicks = inject(injectionClicks)
const elements = inject(injectionClicksElements)
const disabled = inject(injectionClicksDisabled)
const applyStyle = (st, clear=false) => e => {
  for (const k in st) {
    if (clear || st[k] === undefined) {
      e.style.removeProperty(k)
    } else {
      e.style.setProperty(k, st[k])
    }
  }
}
const actions = {
  show: {
    doit({all}, sel) {
      all(sel, e => e.classList.add('anim-shown'))
      all(sel, e => e.classList.remove('anim-hidden'))
    },
    undo({all}, sel) {
      all(sel, e => e.classList.add('anim-hidden'))
      all(sel, e => e.classList.remove('anim-shown'))
    },
  },
  hide: {
    doit({all}, sel) {
      all(sel, e => e.classList.remove('anim-shown'))
      all(sel, e => e.classList.add('anim-hidden'))
    },
    undo({all}, sel) {
      all(sel, e => e.classList.remove('anim-hidden'))
      all(sel, e => e.classList.add('anim-shown'))
    },
  },
  addClass: {
    doit({all}, cl, sel) {
      all(sel, e => e.classList.add(cl))
    },
    undo({all}, cl, sel) {
      all(sel, e => e.classList.remove(cl))
    },
  },
  removeClass: {
    doit({all}, cl, sel) {
      all(sel, e => e.classList.remove(cl))
    },
    undo({all}, cl, sel) {
      all(sel, e => e.classList.add(cl))
    },
  },
  step: {
    init({el}) {
      //el.targetStep = undefined
    },
    doit({el, all, querySelectorAll}, i) {
      /*
      if (el.targetStep === 0) {
      } else if (el.targetStep === i) {
      }*/
      el.classList.remove('anim-notnow')
      all('.anim-now', e => e.classList.remove('anim-now'))
      let current = querySelectorAll('.step')[i-1]
      while (current && current !== el) {
        current.classList.add('anim-now')
        current = current.parentElement
      }
    },
    undo({all, querySelector, querySelectorAll, el, willDo}, i) {
      /*
      if (el.targetStep === undefined) {
        el.targetStep = 0
      }
      if (el.targetStep === 0 && willDo) {
        el.targetStep = i
      }
      */
      {
        let current = querySelectorAll('.step')[i-1]
        while (current && current !== el) {
          current.classList.add('anim-nowable')
          current = current.parentElement
        }
      }
      el.classList.add('anim-nowable')

      el.classList.remove('anim-notnow')
      all('.anim-now', e => e.classList.remove('anim-now'))
      let current = querySelector('.step0')
      if (current === null) {
        el.classList.add('anim-notnow')
      }
      while (current && current !== el) {
        current.classList.add('anim-now')
        current = current.parentElement
      }
    },
  },
  viewBoxAs: {
    init({querySelector}, boxSelector) {
      const e = querySelector(boxSelector)
      if (e === null) {
        return
      }
      if (e.viewportElement !== undefined) { // SVG
        const svg = e.viewportElement || e // viewportElement is defined but null on svg root elements
        if (svg.baseViewBox === undefined) {
          svg.baseViewBox = svg.getAttribute('viewBox') ?? ''
        } else {
          svg.setAttribute('viewBox', svg.baseViewBox)
        }
      }
      // TODO css based for non svg
    },
    doit({querySelector, fast}, boxSelector, duration) {
      const durationMs = parseDuration(duration, 'ms')
      const matrixXY = (m,x,y) => [x * m.a + y * m.c + m.e, x * m.b + y * m.d + m.f ]
      const transpose = m => m[0].map((_,i) => m.map(x => x[i]))
      const getTransformedViewBox = (e, svg) => {
        const m = svg.getScreenCTM().inverse().multiply(e.getScreenCTM())
        const b = e.getBBox()
        const corners = [[b.x,b.y], [b.x+b.width,b.y], [b.x+b.width,b.y+b.height], [b.x,b.y+b.height]]
        const tcorners = transpose(corners.map(([x,y]) => matrixXY(m, x, y)))
        const x = Math.min(...tcorners[0])
        const y = Math.min(...tcorners[1])
        return [x, y, Math.max(...tcorners[0])-x, Math.max(...tcorners[1])-y]
      }
      const e = querySelector(boxSelector)
      if (e === null) {
        return
      }
      if (e.viewportElement !== undefined) {
        const svg = e.viewportElement || e
        if (svg.getScreenCTM() === null) return
        const vb = getTransformedViewBox(e, svg)
        if (fast) {
          svg.setAttribute('viewBox', vb.join(' '))
        } else {
          const current = svg.getAttribute('viewBox')
          svg.currentViewBoxAnimate = animate({
            from: current,
            to: vb.join(' '),
            duration: durationMs,
            onUpdate: latest => svg.setAttribute('viewBox', latest)
          })
        }
      }
    },
    undo({querySelector}, boxSelector) {
      const e = querySelector(boxSelector)
      if (e === null) {
        return
      }
      if (e.viewportElement !== undefined) {
        const svg = e.viewportElement || e
        svg.currentViewBoxAnimate?.stop?.()
        svg.currentViewBoxAnimate = undefined
      }
    },
  },
  moveAlong: {
    init({all}, pathSelector, duration, sel) {
      all(sel, e => {
        e.dataNextStart = [0, 0]
        if (e.viewportElement !== undefined) { // SVG
          if (e.baseTransform === undefined) {
            e.baseTransform = e.getAttribute('transform') ?? ''
          } else {
            e.setAttribute('transform', e.baseTransform)
          }
        } else { // Non-SVG
          if (e.baseTransform === undefined) {
            e.baseTransform = e.style.transform // '' by default
          } else {
            e.style.transform = e.baseTransform
          }
        }
      })
    },
    doit({all, fast, querySelector}, pathSelector, duration, sel) {
      const durationMs = parseDuration(duration, 'ms')
      const backward = pathSelector.startsWith('-')
      const pathElement = querySelector(pathSelector.substr(backward ? 1 : 0))
      if (pathElement === null) return
      all(sel, e => {
        let start = e.dataNextStart
        const len = pathElement.getTotalLength()
        const s = pathElement.getPointAtLength(backward ? len : 0)
        const end = pathElement.getPointAtLength(backward ? 0 : len)
        e.dataNextStart = [start[0]+end.x-s.x, start[1]+end.y-s.y]

        const setTransform = v => {
          const p = pathElement.getPointAtLength((backward ? 1-v : v) * len)
          if (e.viewportElement !== undefined) { // SVG
            e.setAttribute('transform', `translate(${p.x-s.x+start[0]} ${p.y-s.y+start[1]}) ${e.baseTransform}`)
          } else { // Non-SVG
            e.style.transform = `translate(${p.x-s.x+start[0]}px, ${p.y-s.y+start[1]}px) ${e.baseTransform}`
          }
        }
        if (fast) {
          setTransform(1)
          return
        }
        e.currentMoveAlongAnimate = animate({from: 0, to: 1, onUpdate: setTransform, duration: durationMs})
      })
    },
    undo({all}, pathSelector, duration, sel) {
      all(sel, e => {
        e.currentMoveAlongAnimate?.stop?.()
        e.currentMoveAlongAnimate = undefined
      })
    },
  }
}
function makeid(length = 5) {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++)
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  return result.join('')
}
const parsePart = (context: any) => (p:string) => {
  // NB: p gets modified by utility functions
  let prefix = null
  function hasPrefix(pr) {
    if (p.startsWith(pr)) {
      prefix = pr
      p = p.substr(pr.length)
      return true
    }
    return false
  }
  function splitFirst(pat) {
    const m = p.match(pat)
    if (m == null) throw `Cannot match «${pat}» in «${p}»`
    prefix = p.substr(0, m.index)
    p = p.substring(m.index + m[0].length)
    return prefix
  }
  if (hasPrefix('+'))
    return ['show', p]
  if (hasPrefix('-'))
    return ['hide', p]
  if (hasPrefix('@+class ')) {
    const cl = splitFirst(/ +/)
    return ['addClass', cl, p]
  }
  if (hasPrefix('@-class ')) {
    const cl = splitFirst(/ +/)
    return ['removeClass', cl, p]
  }
  if (hasPrefix('@along ')) {
    const pathSelector = splitFirst(/ +/)
    return ['moveAlong', pathSelector, context.defaultDuration, p]
  }
  if (hasPrefix('@alongd ')) {
    const pathSelector = splitFirst(/ +/)
    const duration = splitFirst(/ +/)
    return ['moveAlong', pathSelector, duration, p]
  }
  if (hasPrefix('@viewbox ')) {
    return ['viewBoxAs', p, context.defaultDuration]
  }
  if (hasPrefix('@viewboxd ')) {
    const boxSelector = splitFirst(/ +/)
    return ['viewBoxAs', boxSelector, p]
  }
  if (hasPrefix('@step ')) {
    if (p.indexOf('-') !== -1) {
      alert('@step "'+p+'" contains "-", did you mean @steps?')
    }
    return ['step', parseInt(p)]
  }
  if (hasPrefix('@steps ')) {
    if (context.forbidComposite) {
      alert('@steps is not allowed here (e.g. in ^ separated steps), use @step')
      return []
    }
    // TODO should find the total number... but how... so no for now
    return parseRangeString(42, p).map(i => ['step', i])
  }
  if (hasPrefix('@maths ')) {
    // TODO should find the total number... but how... so no for now
    const r = parseRangeString(42, p)
    if (r.length > 1 && context.forbidComposite) {
      alert('@maths with a range is not allowed here (e.g. in ^ separated steps)')
      return []
    }
    return r.map(i => ['show', '.mtable>* .vlist>span:not(.vlist .vlist span):nth-of-type('+i+')'])
  }
  if (hasPrefix('@mathsc ')) {
    // TODO should find the total number... but how... so no for now
    const rangeSpec = splitFirst(/ +/)
    const r = parseRangeString(42, rangeSpec)
    if (r.length > 1 && context.forbidComposite) {
      alert('@mathsc with a range is not allowed here (e.g. in ^ separated steps)')
      return []
    }
    return r.map(i => ['show', p+' .mtable>* .vlist>span:not(.vlist .vlist span):nth-of-type('+i+')'])
  }
  if (p.startsWith('@')) {
    alert('Unhandled @ animation: '+p)
  }
  return ['show', p]
}

const el = ref<HTMLDivElement>()
const vm = getCurrentInstance()
const steps = computed(() => {
  const {dur:defaultDuration} = props
  const ctx = {defaultDuration}
  const spec = props.spec.trim()
  if (spec.length == 0) {
    return []
  }
  const res = []
  spec.split(/\|/g).map(i => {
    if (i.trim().match(/ +\^ +/)) {
      res.push(i.trim().split(/ +\^ +/g).map(parsePart({ctx, forbidComposite: true})))
    } else { // here allow multi-steps
      let parts:any = parsePart(ctx)(i.trim())
      if (typeof parts?.[0] === 'string') {
        parts = [parts]
      }
      res.push(...parts.map(p => [p]))
    }
  })
  return res
})
const updateAll = ref(()=>{})
onMounted(() => {
  const prev = props.at == null ? elements?.value.length : props.at
  const index = computed(() => {
    if (disabled?.value) {
      return steps.value.length - 1
    }
    return Math.min(Math.max(0, (clicks?.value || 0) - (prev || 0)), steps.value.length)
  })
  if (steps.value.length >= 1 && !disabled?.value) {
    const id = makeid()
    const ids = range(steps.value.length).map(i => id + i)
    if (elements?.value) {
      elements.value.push(...ids)
      onUnmounted(() => ids.forEach(i => remove(elements.value, i)), vm)
    }
  }
  let _previousIndex = undefined
  updateAll.value = () => {
    if (!el.value) {
      _previousIndex = undefined
      return
    }
    const previousIndex = _previousIndex
    _previousIndex = index.value
    const helper = {
      all: (sel, f) => el.value.querySelectorAll(sel).forEach(f), // path should also be looked only in the slide (or even the anim?) -> provide a qs() helper
      querySelector: sel => el.value.querySelector(sel),
      querySelectorAll: sel => el.value.querySelectorAll(sel),
      el: el.value,
    }
    // allow action to (re)init/setup things on the elements
    for (let i = steps.value.length-1; i >= 0; --i) {
      for (const part of steps.value[i]) {
        const [action, ...params] = part
        if (actions[action]) {
          actions[action].init?.(helper, ...params)
        } else {
          alert('Action not found: '+action)
        }
      }
    }
    // reverse swipe to init using undo (by convention showing/unhiding an element means it is automatically hidden at the beginning)
    for (let i = steps.value.length-1; i >= 0; --i) {
      const willDo = i < index.value
      for (const part of steps.value[i]) {
        const [action, ...params] = part
        actions[action].undo({...helper, willDo}, ...params)
      }
    }
    // forward on the passed clicks
    for (let i = 0; i < index.value; ++i) {
      const delta = index.value - previousIndex
      //console.log(__slidev__.nav.currentPage, previousIndex, index.value, delta, steps.value.length)
      const fast = i < index.value-1 || delta < 1 || delta > 1 || (previousIndex === undefined && index.value == steps.value.length - 1)
      const last = i == index.value-1
      for (const j in steps.value[i]) {
        const part = steps.value[i][j]
        const [action, ...params] = part
        // todo might have some optimization while step by step, e.g., not undoing/redoing all
        actions[action].doit({...helper, fast, last}, ...params)
      }
    }
  }
  watchEffect(updateAll.value)
})
provide('notifyAsyncDone', updateAll)
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>