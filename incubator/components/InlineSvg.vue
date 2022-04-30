<script lang="ts">
import { h, ref, inject, nextTick } from "vue";

let nextId = 1
function generateId(/*oldId*/) {
  let id = 'uniquesvg' + nextId
  nextId++
  return id
}
let referencingAttributes = ['clip-path', 'color-profile', 'fill', 'filter', 'marker-start', 'marker-mid', 'marker-end', 'mask', 'stroke']

export default {
  props: {
    src: { default: "" },
    wrap: { default: undefined },
    width: { default: undefined },
    height: { default: undefined },
    opts: { default: {} },
  },
  setup(props) {
    // Ancestor components are free to inject a ref<callback> to know when this is rendered.
    const notifyAsyncDone = inject(
      "notifyAsyncDone",
      ref(() => {})
    );
    const rawSvg = ref("");
    (async function () {
      //console.log(import.meta.env.BASE_URL, props.src.replace(/^\//, ''))
      let req = await fetch(import.meta.env.BASE_URL + props.src.replace(/^\//, ''))
      rawSvg.value = await req.text()
      /*
      TODO: this might be useful if we manage to make it inlined for single-file release
      rawSvg.value = (
        await import(props.src + "?raw")
      ).default;
      */
    })();
    return () => {
      nextTick(() => {
        notifyAsyncDone.value()
      });
      let patchedSVG = rawSvg.value
      let opts = Object.assign({
        addViewBox: true,
        xlinkRewrite: true,
        prefixHrefs: true,
        styleToAttributes: true,
        idRewrite: true,
      }, props.opts)
      if (patchedSVG) {
        let d = document.createElement('div')
        d.innerHTML = patchedSVG
        let svg = d.children[0]

        if (opts.addViewBox) {
          let vb = svg.getAttribute('viewBox')
          if (vb === null) {
            let units = {
              '': 1,
              px: 1,
              cm: 96 / 2.54,
              mm: 96 / 10 / 2.54,
              Q: 96 / 40 / 2.54,
              in: 96,
              pc: 96 / 6,
              pt: 96 / 72,
            }
            let px = str => {
              // see https://www.w3.org/TR/css3-values/#absolute-lengths
              var parts = str.split(/^([\d.]+)/).slice(1)
              return parseFloat(parts[0]) * units[parts[1]]
            }
            let w = svg.getAttribute('width')
            let h = svg.getAttribute('height')
            vb = `0 0 ${px(w)} ${px(h)}`
            svg.setAttribute('viewBox', vb)
          }
          svg.removeAttribute('width')
          svg.removeAttribute('height')
        }

        if (opts.xlinkRewrite) {
          // change xlink:href to plain href as xlink: is not supported anymore
          svg.querySelectorAll('[*|href]:not([href])').forEach(e => {
            if (e.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
              e.setAttribute('href', e.getAttributeNS('http://www.w3.org/1999/xlink', 'href'))
              e.removeAttributeNS('http://www.w3.org/1999/xlink', 'href')
            }
          })
        }

        if (opts.prefixHrefs) {
          // prefix href with the base svg path
          svg.querySelectorAll('[href]').forEach(e => {
            let href = e.getAttribute('href').trim()
            if (!href.startsWith('#')) {
              e.setAttribute('href', props.src.replace(/\/[^/]*$/, '/')+href)
            }
          })
        }

        if (props.width) {
          svg.setAttribute('width', props.width)
        }
        if (props.height) {
          svg.setAttribute('height', props.height)
        }

        if (opts.styleToAttributes) {
          // style to attributes
          svg.querySelectorAll('[style]').forEach(e => {
            let st = e.getAttribute('style')
            if (st) {
              st.trim()
                .split(/ *; */)
                .forEach(style => {
                  if (style && style.substring(0, 1) !== '-') {
                    let s = style.trim().split(/ *: */)
                    e.setAttribute(s[0], s[1])
                  }
                })
              e.removeAttribute('style')
            }
          })
        }

        if (opts.idRewrite) {
          // makeReferencedIdsUnique
          let byId = {}
          let referencersIds = {}
          let pushAdd = function(k, o) {
            if (referencersIds[k] !== undefined) {
              referencersIds[k].push(o)
            } else {
              referencersIds[k] = [o]
            }
          }
          // gather all ids and references
          svg.querySelectorAll('*').forEach(e => {
            let id = e.id
            if (id) {
              byId[id] = e
            }
            for (let attr of referencingAttributes) {
              let val = e.getAttribute(attr)
              if (val) {
                // TODO: handle multiple matches (e.g. style not rewritten) and non-full matches too (e.g. same)
                let groups = val.trim().match(/^url\(#(.+?)\)$/)
                if (groups) {
                  pushAdd(groups[1], { o: e, a: attr })
                }
              }
            }
            var xlink = e.getAttribute('href')
            if (xlink) {
              var groups = xlink.trim().match(/^#(.+?)$/)
              if (groups) {
                pushAdd(groups[1], {o: e, a: 'href' })
              }
            }
          })


          // patch used ids and references (keep unreferenced ids fixed (to allow for identification from the editor to the css, even if classes should be preferred))
          let newIds = {}
          //*
          for (let id in referencersIds) {
            let newId = generateId()//id)
            byId[id].id = newId
            newIds[id] = newId
            byId[id].classList.add(`idwas-${id}`)
          }
          for (let id in referencersIds) {
            let newId = newIds[id]
            let refs = referencersIds[id]
            for (let pair of refs) {
              let prev = pair.o.getAttribute(pair.a)
              let now
              if (pair.a === 'href') {
                now = prev.replace('#' + id, '#' + newId)
              } else {
                now = prev.replace('(#' + id + ')', '(#' + newId + ')')
              }
              if (prev !== now)
                pair.o.setAttribute(pair.a, now)
            }
          }
          //*/
        }

        patchedSVG = d.innerHTML
     }
     return h("div", { [props.wrap === undefined ? 'outerHTML' : 'innerHTML']: patchedSVG, width: props.width, height: props.height });
    };
  },
};
</script>
