

export const animStyleSheet = new CSSStyleSheet()

animStyleSheet.replaceSync(`
:root {
	--anim-show-duration: 400ms;
	--anim-hide-duration: 100ms;
	--anim-step-opacity: 0.15;
}
.anim-shown { opacity: 1; transition: all var(--anim-show-duration); }
.anim-hidden { opacity: 0; transition: all var(--anim-hide-duration); }
.anim-nowable, .anim-nowable ~ * { transition: all var(--anim-show-duration) ease-out; }
.anim-notnow, .anim-now ~ * { opacity: var(--anim-step-opacity); transition-duration: 0ms !important; transition-timing-function: ease-out; }
/* css is tricky (and imperfect) with nested lists... */
`)

const injectStyleSheet = (e) => {
    e.adoptedStyleSheets = e.adoptedStyleSheets.filter(s => !s.__isAnimStyleSheet) 
    animStyleSheet.__isAnimStyleSheet = true // to be able to remove it in case of hot reload
    e.adoptedStyleSheets.push(animStyleSheet)
}
injectStyleSheet(globalThis.document)

export const pseudoQuerySelector = (isAll, e, s, addStyleSheet=true) => {
  if (s.indexOf('::part(') === -1) {
  }
  const splitSelector = s => {
    if (s.indexOf('::shadow') !== -1) {
      return s.split('::shadow')
    }
    if (s.indexOf('::part(') !== -1) {
      const parts = s.split('::part(')
      if (parts.length !== 2) {
        globalThis.console.log('WARNING: non-2-length parts', parts)
      }
      if (parts[0] === '') {
        globalThis.console.log('WARNING: performance risk with non-prefixed ::part()', s)
      }
      if (parts[0].indexOf(',') !== -1) {
        globalThis.console.log('WARNING: found a comma on the left of ::part(), this might not be well handled', s)
      }
      return [parts[0], '::part('+parts[1]]
    }
    return [s]
  }
  let [host, sub] = splitSelector(s)
  if (sub === undefined) {
    return isAll ? e.querySelectorAll(s) : e.querySelector(s)
  }
  let res = [...e.querySelectorAll(host || '*')]
  globalThis.console.log('1', isAll, res)
  if (addStyleSheet && res.some(e => e.shadowRoot)) {
    res.forEach(e => e.shadowRoot ? injectStyleSheet(e.shadowRoot) : 'pass')
  }
  if (sub === '') {
    res = res.map(e => e.shadowRoot?.children)
  } else {
    res = res.map(e => e.shadowRoot?.querySelectorAll(sub))
  }
  globalThis.console.log('2', isAll, res)
  res = res.flatMap(e=>e ? [...e] : [])
  globalThis.console.log('3', isAll, res)
  return isAll ? res : (res[0] ?? null)
}
 