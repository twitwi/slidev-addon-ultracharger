<script setup lang="ts">
import { range, remove } from '@antfu/utils'
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref, watchEffect, provide } from 'vue'
import { injectionClicks, injectionClicksElements, injectionClicksDisabled } from '@slidev/client/constants.ts'
import { parseRangeString } from '@slidev/parser'
import parseDuration from 'parse-duration'
import { animate } from "popmotion"
import parse from 'parse-duration'
import { pseudoQuerySelector } from '../anim-helper'

const props = defineProps({
  spec: {
    default: () => '@step 1-',
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
  highlight: {
    doit({all}, sel) {
      all(sel, e => e.classList.remove('dishonored'))
      all(sel, e => e.classList.remove('dishonored2'))
      all(sel, e => e.classList.add('highlighted'))
    },
    undo({all}, sel) {
      all(sel, e => e.classList.remove('highlighted'))
      all(sel, e => e.classList.add('dishonored'))
      all(sel, e => e.classList.add('dishonored2'))
    },
  },
  unhighlight: {
    doit({all}, sel) {
      all(sel, e => e.classList.remove('highlighted'))
      all(sel, e => e.classList.add('dishonored'))
      all(sel, e => e.classList.add('dishonored2'))
    },
    undo({all}, sel) {
      all(sel, e => e.classList.remove('dishonored'))
      all(sel, e => e.classList.remove('dishonored2'))
      all(sel, e => e.classList.add('highlighted'))
    },
  },
  inlineShow: {
    doit({all}, sel) {
      all(sel, e => e.style.opacity = 1)
    },
    undo({all}, sel) {
      all(sel, e => e.style.opacity = 0)
    },
  },
  inlineHide: {
    doit({all}, sel) {
      all(sel, e => e.style.opacity = 0)
    },
    undo({all}, sel) {
      all(sel, e => e.style.opacity = 1)
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
  // returns either one action (e.g. ['show', 'div']) or a list of steps, each is a list of action (e.g. [[['show', 'div']]])

  // NB: p gets modified by utility functions
  let prefix = null
  function hasPrefix(pr) {
    if (p.startsWith(pr)) {
      prefix = pr
      p = p.substring(pr.length)
      return true
    }
    return false
  }
  function splitFirst(pat) {
    const m = p.match(pat)
    if (m == null) throw `Cannot match «${pat}» in «${p}»`
    const prefix = p.substring(0, m.index)
    p = p.substring(m.index + m[0].length)
    return prefix
  }
  if (hasPrefix('++'))
    return ['inlineShow', p]
  if (hasPrefix('--'))
    return ['inlineHide', p]
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
    const r = parseRangeString(context.nStepElements() + 1, p)
    if (r.length > 1 && context.forbidComposite) {
      alert('@steps is not allowed here (e.g. in ^ separated steps), use @step')
      return []
    }
    if (r.length === 1) {
      return ['step', r[0]]
    } else {
      return r.map(i => [['step', i]])
    }
  }
  const mathSelectorBase = '.mtable'
  const mathSelectorBaseFirst = '.mtable:first-of-type'
  const mathSelectorSub = '>* .vlist>span:not(.vlist .vlist span)'
  const mathSelector = mathSelectorBase + mathSelectorSub
  if (hasPrefix('@math ')) { // TODO this is a refactored copy, do proper refactoring
    let rangeSpec = p
    let ctxSel = ''
    let highlightMode = false
    let stepMode = true
    try {
      rangeSpec = splitFirst(/ +/)
      ctxSel = p + ' '
    } catch {
      // pass
    }
    if (rangeSpec.startsWith('[')) { // Block mode
      if (!rangeSpec.trimEnd().endsWith(']')) {
        alert('@math with a range spec must end in ] (and must not contain spaces)')/**/
        return []
      }
      stepMode = false
      rangeSpec = rangeSpec.trimEnd().slice(1, -1)
    } else if (rangeSpec.startsWith('{')) { // Highlight-syntax for slidev compat
      if (!rangeSpec.trimEnd().endsWith('}')) {
        alert('@math with a slidev range spec must end in } (and must not contain spaces)')/**/
        return []
      }
      highlightMode = true
      rangeSpec = rangeSpec.trimEnd().slice(1, -1)
    }
    if (highlightMode) {
      const ranges = rangeSpec.split(/\|/g).map(r => parseRangeString(context.nMathElements/**/(ctxSel), r))
      const res: string[][][] = []
      for (const r of ranges) {
        const subres = []
        res.push(subres)
        for (const target of context.elValue().querySelectorAll(ctxSel+mathSelectorBaseFirst/**/)) {
          target.querySelectorAll(':scope '+mathSelectorSub/**/).forEach((e, i) => {
            subres.push([r.includes(i+1) ? 'highlight' : 'unhighlight', ctxSel+mathSelector/**/+':nth-of-type('+(i+1)+')'])
          })
        }
      }
      return res
    } else {
      const ranges = rangeSpec.split(/\|/g).map(r => parseRangeString(context.nMathElements/**/(ctxSel), r))
      let res: string[][] | string[][][] = [] as string[][][]
      for (const r of ranges) {
        res.push(r.map(i => ['show', ctxSel+mathSelector/**/+':nth-of-type('+i+')']))
      }
      if (stepMode) {
        res = res.flat().map(e => [e])
      }
      if (res.length > 1 && context.forbidComposite) {
        alert('@math with a range is not allowed here (e.g. in ^ separated steps)')/**/
        return []
      }
      return res
    }
  }
  const codeSelectorBase = 'pre.slidev-code>code'
  const codeSelectorBaseFirst = 'pre.slidev-code:first-of-type>code'
  const codeSelectorSub = '>span.line'
  const codeSelector = codeSelectorBase + codeSelectorSub
  if (hasPrefix('@code ')) {
    let rangeSpec = p
    let ctxSel = ''
    let highlightMode = false
    let stepMode = true
    try {
      rangeSpec = splitFirst(/ +/)
      ctxSel = p + ' '
    } catch {
      // pass
    }
    if (rangeSpec.startsWith('[')) { // Block mode
      if (!rangeSpec.trimEnd().endsWith(']')) {
        alert('@code with a range spec must end in ] (and must not contain spaces)')
        return []
      }
      stepMode = false
      rangeSpec = rangeSpec.trimEnd().slice(1, -1)
    } else if (rangeSpec.startsWith('{')) { // Highlight-syntax for slidev compat
      if (!rangeSpec.trimEnd().endsWith('}')) {
        alert('@code with a slidev range spec must end in } (and must not contain spaces)')
        return []
      }
      // NB: splitted there in the codeblock https://github.com/slidevjs/slidev/blob/0abf4cb9a9824e790d236a662bf9c8674a00374f/packages/slidev/node/plugins/markdown.ts#L152
      highlightMode = true
      rangeSpec = rangeSpec.trimEnd().slice(1, -1)
      // https://github.com/slidevjs/slidev/blob/main/packages/client/builtin/CodeBlockWrapper.vue#L72
      // Contains things not mimicked here: CLASS_VCLICK_TARGET, scrollIntoView, narrower targets
    }
    if (highlightMode) {
      const ranges = rangeSpec.split(/\|/g).map(r => parseRangeString(context.nCodeElements(ctxSel), r))
      const res: string[][][] = []
      for (const r of ranges) {
        const subres = []
        res.push(subres)
        for (const target of context.elValue().querySelectorAll(ctxSel+codeSelectorBaseFirst)) {
          target.querySelectorAll(':scope '+codeSelectorSub).forEach((e, i) => {
            subres.push([r.includes(i+1) ? 'highlight' : 'unhighlight', ctxSel+codeSelector+':nth-of-type('+(i+1)+')'])
          })
        }
      }
      return res
    } else {
      const ranges = rangeSpec.split(/\|/g).map(r => parseRangeString(context.nCodeElements(ctxSel), r))
      let res: string[][] | string[][][] = [] as string[][][]
      for (const r of ranges) {
        res.push(r.map(i => ['show', ctxSel+codeSelector+':nth-of-type('+i+')']))
      }
      if (stepMode) {
        res = res.flat().map(e => [e])
      }
      if (res.length > 1 && context.forbidComposite) {
        alert('@code with a range is not allowed here (e.g. in ^ separated steps)')
        return []
      }
      return res
    }
  }
  if (p.startsWith('@')) {
    alert('Unhandled @ animation: '+p)
  }
  return ['show', p]
}

const el = ref<HTMLDivElement>()
const vm = getCurrentInstance()
const computeSteps = (el) => {
  const {dur:defaultDuration} = props
  const ctx = {
    defaultDuration,
    elValue: () => el,
    nStepElements: () => el.querySelectorAll('.step').length,
    nMathElements: (p="") => Math.max(...[...el.querySelectorAll(p+'.mtable>* .vlist')].map(vl => vl.querySelectorAll(':scope>span:not(.vlist .vlist span)').length)),
    nCodeElements: (p) => Math.max(...[...el.querySelectorAll(p+' pre.slidev-code:first-of-type>code')].map(vl => vl.querySelectorAll(':scope>span.line').length)),
  }

  const spec = props.spec.trim()
  if (spec.length == 0) {
    return []
  }
  const res: string[][][] = [] // list of steps, each a list of actions, each a descriptor (list of string)
  spec.split(/\| /g).forEach(i => {
    
    if (i.trim().match(/ +\^ +/)) {
      const subres:string[][] = []
      res.push(subres)
      i.trim().split(/ +\^ +/g)
      .map(parsePart({...ctx, forbidComposite: true}))
      .forEach(parts => {
        if (typeof parts?.[0] === 'string') {
          subres.push(parts)
        } else {
          if (parts.length > 2) {
            alert('Too many steps while forbidComposite:true was passed')
          }
          subres.push(...parts[0])
        }
      })
    } else { // here allow multi-steps (that get unfolded)
      let parts:any = parsePart(ctx)(i.trim())
      if (typeof parts?.[0] === 'string') {
        res.push([parts])
      } else {
        res.push(...parts)
      }
    }
  })
  return res
}

const updateAll = ref(()=>{})
onMounted(() => {
  const steps = computeSteps(el.value)
  const prev = props.at == null ? elements?.value.length : props.at
  const index = computed(() => {
    if (disabled?.value) {
      return steps.length
    }
    return Math.min(Math.max(0, (clicks?.value || 0) - (prev || 0)), steps.length)
  })
  if (steps.length >= 1 && !disabled?.value) {
    const id = makeid()
    const ids = range(steps.length).map(i => id + i)
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
      all: (sel, f) => pseudoQuerySelector(true, el.value, sel).forEach(f), // path should also be looked only in the slide (or even the anim?) -> provide a qs() helper
      querySelector: sel => pseudoQuerySelector(false, el.value, sel),
      querySelectorAll: sel => pseudoQuerySelector(true, el.value, sel),
      el: el.value,
    }
    // allow action to (re)init/setup things on the elements
    for (let i = steps.length-1; i >= 0; --i) {
      for (const part of steps[i]) {
        const [action, ...params] = part
        if (actions[action]) {
          actions[action].init?.(helper, ...params)
        } else {
          alert('Action not found: '+action)
        }
      }
    }
    // reverse swipe to init using undo (by convention showing/unhiding an element means it is automatically hidden at the beginning)
    for (let i = steps.length-1; i >= 0; --i) {
      const willDo = i < index.value
      for (const part of steps[i]) {
        const [action, ...params] = part
        actions[action].undo({...helper, willDo}, ...params)
      }
    }
    // forward on the passed clicks
    for (let i = 0; i < index.value; ++i) {
      const delta = index.value - previousIndex
      //console.log(__slidev__.nav.currentPage, previousIndex, index.value, delta, steps.length)
      const fast = i < index.value-1 || delta < 1 || delta > 1 || (previousIndex === undefined && index.value == steps.length - 1)
      const last = i == index.value-1
      for (const j in steps[i]) {
        const part = steps[i][j]
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
