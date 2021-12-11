---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/ko6bm-cNL-U/medium
attribution: Photo by <a href="https://unsplash.com/@bldjordan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jordan Billard</a> on <a href="https://unsplash.com/s/photos/mont-blanc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Personnal Incubator
  Uses [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
title: "Incubating some slidev plugins/components/etc."
subtitle: ...used as both a test page and a quick documentation
date: "2021-12-11"
venue: Online
author: Rémi Emonet
---

# <span v-html="$slidev.configs.title?.replaceAll(' ', '<br/>')"></span>

<br/><br/><br/><br/><br/><br/>

Each feature is illustrated in its own part.

Some guidance about usage/limitations/evolutions/improvements/TODO/etc is given.

<style>
  :deep(footer) { padding-bottom: 3em !important; }
</style>

---
src: ./separator.md
---

---

# FEATURE: title page / closing page

Displays metadata
(see next slide)

Here, directly in the slides.

> TODO: could change it to utility functions or *have it as a component*.

---
background: https://source.unsplash.com/9Y9I1T4yOvo/medium
attribution: Photo by <a href="https://unsplash.com/@jackywatt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jacky Watt</a> on <a href="https://unsplash.com/collections/338595/walls?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
layout: cover
---

# <span v-html="$slidev.configs.title?.replaceAll(' ', '<br/>')"></span>

<p v-html="$slidev.configs.subtitle?.replaceAll(' ', '<br/>')" class="bg-black py-5 py-2"></p>

<p v-html='"date author venue".split(" ").map(k => $slidev.configs[k]).join(" <br/> ")'></p>

---
src: ./separator.md
---

---

# FEATURE: a/z keys for slide browsing

Use <kbd>a</kbd> and <kbd>z</kbd> to navigate from slide to slide, showing the slides as they look after all clicks (animations) contrary to up/down arrows.

- defined in `./setup/shortcuts.vue`

---
src: ./separator.md
---

---

# FEATURE: b key to blackout

Use <kbd>b</kbd> to blackout remote clients' views (from presenter).

- defined as a component in `./components/Blackout.vue`
- should be instantiated in `./global-top.vue`
- registration of the keyboard shortcut in `./setup/shortcuts.ts`
- NB: to test, open a client and a presenter view and press <kbd>b</kbd> in the presenter view.

---
src: separator.md
---

---

# FEATURE: Katex remember definitions

Can use gdef in katex/latex code and reuse them in other blocks or even slides.

- ~~defined in `./setup/katex.vue`~~ might work by default (but it is still cool)

---

# Katex memory

We can have a block with our macro definitions

$$
\gdef\xy{\green{X,y}}
\text{we can define macros and use them in a block: } \xy{}
$$

And use them in our text $\xy$

or in some block

$$
\text{we can use in a block: } \xy{}
$$

but also reuse in another block $\xy{}$


---

# Katex memory across slides

even in another slide, we can reuse definitions $\xy{}$


---
src: ./separator.md
---

---

# FEATURE: footer

Also displays metadata
(see any footer)

- defined in `./global-top.vue` (TODO: a component for filenames that link to the source on github)
- can change the total (e.g. if you know you have 10 extra slides used -9 instead of +1)

---
src: separator.md
---

---

# FEATURE: outline

It allows to define and then copy a fragment of slide, and also to highlight some of it's parts.

It is somewhat redundant with existing features such as the `src` attribute or `.md` components, but it remains slightly different.

- defined in `./components/Outline.vue`

---

# Outline

(here we define the outline)

<Outline>

- First part of the talk
- Second part
- Last part
- Questions? Discussion?
- More stuff? 

</Outline>

---

# Outline

(here we reuse the outline, highlight one of its part)

<Outline :current="1" />

NB: the element must be empty (directly with `/>`)

---

# Outline

(and again)

<Outline :current="2" />

NB: the highlight is done with the css class highlight, that can be overriden, here locally

<style>
  :deep(.highlight) { color: blue; filter: blur(2px); }
</style>

---

# Outline

(and again)

<Outline :current="3" class="highlight-is-green" />

NB: or globally (css overriding), see `./style.css`

---

# <Outline :use="3" />

(we can re-use the text of some outline items, here for the title, and below)

the previous part was "<Outline :use="2"/>"

the next part is "<Outline :use="4" class="inline"/>"

---

# Other outline

(we can have names for outlines if we want several of them, the default is "outline")

Here is an outline named "checklist"

<Outline name="checklist">

- start pomodoro
- work
- relax

</Outline>

Here we reuse it directly, highlighting "<Outline :use="3" name="checklist" class="inline"/>"

<Outline :current="3" name="checklist"/>


---

# Outline

(finally)

<Outline :current="5" />

TODO

- might handle nested outlines e.g. current="1.3"
- might rethink all the thing with the aim of generating the TOC automatically, with links etc, and also generating microTOC (like beamer with the dots)


---
src: ./separator.md
---

---

# FEATURE: click animations (fine grained clicks)

---

# v-clicks every

(feature from slidev)

Can make children appear several at a time.

E.g., slidev is

<v-clicks :every="2">

- 📝 **Text-based** - focus...
- 🎨 **Themable** - theme ...
- 🧑‍💻 **Developer Friendly** - code highlighting, ...
- 🤹 **Interactive** - embedding Vue components ...
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export into PDF, ...
- 🛠 **Hackable** - anything possible on a webpage

</v-clicks>

They appear 2 by 2

---

<Anim spec="li:nth-child(2n) | strong | h1 | li:nth-child(2n+1),a">

# `<Anim spec="...">`, basic appearance

`spec="li:nth-child(2n) | strong | h1 | li:nth-child(2n+1),a"`

(it uses a custom syntax to decide what to show, step by step, steps are separated by `|`, \
each step is here a css selector of the elements to show at this step \
these elements are automatically hidden at the beginning of the slide

Slidev is

- 📝 **Text-based** - focus...
- 🎨 **Themable** - theme ...
- 🧑‍💻 **Developer Friendly** - code highlighting, ...
- 🤹 **Interactive** - embedding Vue components ...
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export into PDF, ...
- 🛠 **Hackable** - anything possible on a webpage

Read more about [Why Slidev?](https://sli.dev/guide/why)

</Anim>

---

NB:

- defined in `./components/Anim.vue`
- some style in `./style.css`
- requires `pnpm install parse-duration`
- more features in the next slides (and in section animating SVG)

---

# `<Anim>`: Hide things, add/remove classes

spec=\
`"-.test | @+class bg-red-500 li | @+class blurry li li, code | @-class bg-red-500 li"`

<Anim spec="-.test | @+class bg-red-500 li | @+class blurry li li, code | @-class bg-red-500 li">

- NB: we can add a `-` to hide an element <span class="test">, e.g. this one</span>
- NB: bg-red-500 is a class that comes from windicss, blurry is defined in the slide
- NB: no problem with css selectors that contain spaces like `li li, code`
- test
  - test2
  - test2
- test

</Anim>

<style>
  .blurry { filter: blur(5px); }
</style>

---

# `<Anim>`: several actions in a step/click

spec=\
`"a | -a ^ strong | -strong ^ em ^ @+class blur div | a,strong ^ @+class blur strong,em"`

<Anim spec="a | -a ^ strong | -strong ^ em ^ @+class blur div | a,strong ^ @+class blur strong,em">

<div>some div here</div>

A link (a) [here is an a](https://sli.dev/guide/why)

Some bold (strong) **here is a strong**

Some italic (em) *here is an em*

</Anim>

<style>
  .blur { filter: blur(3px); }
</style>

---
src: separator.md
---

---

# FEATURE: svg inlining

---

# InlineSvg, loading SVG into the DOM

Use like an `img` but it is inlined: the SVG ends up in the DOM.

This allows CSS styling and js interactions. \
For instance, we set css :hover to blur.

<InlineSvg src="/nn-deep.svg" />

<style>
  /* need :deep() as the loading happens after the automatic addition of scoped css */
  :deep(svg) :hover { filter: blur(3px); }
</style>

---

# InlineSvg, specifying dimensions

The height and/or width can be specified, and will get inserted in the root `svg` element

<InlineSvg src="/nn-deep.svg" height="250px"/>

<InlineSvg src="/nn-deep.svg" height="100px" width="50%"/>

<InlineSvg src="/nn-deep.svg" height="50px" />

<style>
  :deep(svg) { border: 1px solid red; }
</style>

---

# InlineSvg, wrapping

By default, the `InlineSvg` directly ends up as `svg` (with no added properties)

<InlineSvg src="/nn-deep.svg" class="blurry is not considered" />

... `<InlineSvg wrap src=.../>` wraps it (inside a `div`), that inherits the properties (e.g. a `blurry`)

<InlineSvg src="/nn-deep.svg" class="blurry" wrap />

<style>
  .blurry {
    filter: blur(3px);
  }
</style>

NB: height and/or width are applied to the `svg` element

---
src: separator.md
---

---

# FEATURE: svg animations (and related)

(using `<Anim>` and `<InlineSvg>`)

---

# `<Anim>` works with SVG elements

`spec="#rect846 | #path930 | @+class blur text | @-class blur #text26519"`

<Anim spec="#rect846 | #path930 | @+class blur text | @-class blur #text26519">
<InlineSvg src="/nn-deep.svg" />
</Anim>

<style>
  /* need :deep() as the loading happens after the automatic addition of scoped css */
  :deep(svg) .blur { filter: blur(2px); }
</style>

---

# `<Anim>` allows any mix

`spec=".svg2 | .svg1 | #fr1,#fr2 | .svg1 #fr3 | .svg2 #fr3 | -text | em"`

<Anim spec=".svg2 | .svg1 | #fr1,#fr2 | .svg1 #fr3 | .svg2 #fr3 | -text | em">

<InlineSvg src="/TestAnim.svg" width="420px" height="400px" wrap class="half svg1"/>

<InlineSvg src="/TestAnim.svg" width="420px" height="400px" wrap class="half svg2"/>

*And voila!*

</Anim>

<style>
  :deep(svg) { border: 1px solid red; }
  .half { width: 50%; display: inline-block; }
</style>

---

# `<Anim>`: move along SVG path

`spec="@along #path1 #sh1,#sh2
| @along #path1 #sh3
| @along #path1 #sh1-1,#sh2-1,#sh3-1"`

<Anim spec="@along #path1 #sh1,#sh2
| @along #path1 #sh3
| @along #path1 #sh1-1,#sh2-1,#sh3-1">
<InlineSvg src="/TestAnim.svg" height="400px"/>
</Anim>


---

# `<Anim>`: move along, control speed

`dur="700ms"` \
`spec="@along #path1 #sh1,#sh2
| @alongd #path1 2.5s #sh3
| @along #path1 #sh1-1,#sh2-1"`

`dur="..."` to set the default duration + `@alongd` instead of `@along` to specify a duration for the step.

<Anim dur="700ms" spec="@along #path1 #sh1,#sh2
| @alongd #path1 2.5s #sh3
| @along #path1 #sh1-1,#sh2-1">
<InlineSvg src="/TestAnim.svg" height="350px"/>
</Anim>

---

# `<Anim>`: successive move along and backward move

`spec="@along #path1 #sh1,#sh3-1
 |@along #path1 #sh1,#sh3-1` \
`     |@along -#path1 #sh1,#sh3-1
|@along #path1 #sh1,#sh3-1`

NB: newlines are ok in `spec`

<Anim spec="@along #path1 #sh1,#sh3-1
|@along #path1 #sh1,#sh3-1
|@along -#path1 #sh1,#sh3-1
|@along #path1 #sh1,#sh3-1">
<InlineSvg src="/TestAnim.svg" height="330px"/>
</Anim>


---

# `<Anim>`: move along on non-SVG elements

`spec="
 @along #path1   .stuff
|@along #path1-1 .stuff
|@along #path1-1 .stuff"`

NB: still needs an SVG path, also svg vs html units can be tricky.

<Anim spec="
 @along #path1   .stuff
|@along #path1-1 .stuff
|@along #path1-1 .stuff
">
...
<span style="display: inline-block" class="stuff">stuff</span>
...
<span style="display: inline-block" class="stuff">evolve <Counter /></span>
...
<InlineSvg src="/TestAnim.svg" wrap style="display:none"/>
</Anim>

<style>
  .stuff { border: 1px solid red; }
</style>

---
src: separator.md
---

---

# FEATURE: playing with the (SVG) viewBox

(still using `<Anim>`)

---

# `<Anim>`: Playing with the SVG viewBox

`spec="@viewbox #fr1 | @alongd #sh1-1 1500 #sh1-2` \
`    | @viewbox #rect6173 | @viewbox svg | @viewbox #rect6173` \
`    | @viewbox #sh3-1 | @viewboxd #sh1-2 1500 | @viewbox svg"`

NB: using `@viewbox` for default duration or `@viewboxd` to specify the duration.

<Anim spec="@viewbox #fr1 | @alongd #sh1-1 1500 #sh1-2 | @viewbox #rect6173 | @viewbox svg | @viewbox #rect6173 | @viewbox #sh3-1 | @viewboxd #sh1-2 1500 | @viewbox svg">
<InlineSvg src="/TestAnim.svg" height="300px"/>
</Anim>


---

# `<Anim>`: TODO

- TODO: allow specifying ease-in-out etc (like duration)
- TODO: ^ maybe need special steps that set defaults for all coming steps (as in the original @anim)
- TODO: not necessarily possible: fix the @steps issue with opacity animation on nested elements
- TODO: might use :nth-child(... of ...) when/if available in browsers
- TODO: implement viewBox-like anim for non-SVG


---
src: separator.md
---

---

# FEATURE: marker-based steps/clicks

(still using `<Anim>`)

- defined in `./components/Anim.vue` with some CSS in `./style.css`

---

# Marker-based steps, raw, verbose

`spec="@step 1 | @step 2 | @step 3 | @step 4 | @step 5` \
`    | -strong | @step 6 | @step 7 | @step 99"`

NB: using class "step" on the marks \
NB: here some CSS to show the mark \
NB: the content starts hidden (low opacity) \
NB: any big number is ok to show everything

<Anim spec="@step 1 | @step 2 | @step 3 | @step 4 | @step 5 | -strong | @step 6 | @step 7 | @step 99">

- first level
- hum <span class="step"/>
- ok <span class="step"/> <span>now we'll **nest**</span>
  - nested 1 <span class="step"/>
  - nested 2 <span class="step"/> <span>and 2.5</span><span class="step"/>
  - and 3 <span class="step"/>
- voila! <span class="step"/>
- tada!

</Anim>

<style>
  span.anim-now::before { content: ''; outline: 1px solid grey;}
</style>

---

## Marker-based steps, control what is initially shown

`spec="@step 1 | @step 2 | -strong | @step 42"`

NB: use a mark with class `step0` to decide up to where it is inially shown

<Anim spec="@step 1 | @step 2 | -strong | @step 42">

- first level
- hum
- ok now we'll <span class="step0"/> **nest**
  - nested 1
  - nested 2 <span class="step"/> <span>and 2.5</span>
  - and 3
- voila! <span class="step"/>
- tada!

</Anim>

<style>
  span.anim-now::before { content: ''; outline: 1px solid green;}
</style>

---

# Marker-based steps, `@steps` shortcut + special `&|`

`spec="@steps 1-4 | -strong | @steps 5-8"`

NB: can use `@steps` and a range to simplify writting several `@step` \
NB: can use `&|` to insert a span with class `step` (implemented in `./vite.config.ts`)

<Anim spec="@steps 1-4 | -strong | @steps 5-8">

- first level
- hum &|
- ok &| <span>now we'll **nest**</span>
  - nested 1 &|
  - nested 2 &| <span>and 2.5</span>&|
  - and 3 &|
- voila! &|
- tada!

</Anim>

<style>
  span.anim-now::before { content: ''; outline: 1px solid orange;}
</style>

---
src: separator.md
---

---

... nope

# The END