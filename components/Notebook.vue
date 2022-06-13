<template>
    <iframe class="notebookiframe" :src="nbUrl"></iframe>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";

const props = defineProps({
  name: { default: "" },
  basepath: { default: "/nb4slidev" },
  forceHtmlPath: { default: undefined },
  nbid: { default: "default" },
})

const inst = getCurrentInstance()
window.NOTEBOOKS = window.NOTEBOOKS ?? {}
const nbprops = JSON.parse(JSON.stringify(props))
nbprops.html = (props.forceHtmlPath ?? (props.basepath + "/files/")) + props.name + ".html"
window.NOTEBOOKS[props.nbid] = nbprops

const nbUrl = computed(
  () => props.basepath + "/notebooks/" + props.name + ".ipynb"
)
const exportedVersion = ref("<div/>")


onMounted(async () => {
  let req = await fetch(nbprops.html)
  let content = await req.text()
  let doc = new DOMParser().parseFromString(content, 'text/html')
  exportedVersion.value = doc.body.innerHTML
});
</script>
<style>
.notebookcellhtml {
  max-height: 80%;
  overflow-y: scroll;
}
.nbgrid .notebookcellhtml, .nbgrid .notebookiframe {
  /* to test and view more stuff */
  display: inline-block;
  vertical-align: top;
  /*
  transform-origin: 0 0;
  transform: scale(.20, .20);
  */
  width: 25%;
  height: 170px;
  border: 1px solid teal;
  overflow: scroll;
}
.jp-InputArea-prompt, .jp-OutputArea-prompt {
  font-size: 50%;
  opacity: 50%;
}

.notebookcellhtml pre { font-size: 13px; }

/* copied from a notebook export */
.notebookcellhtml pre { line-height: 125%; }
.notebookcellhtml td.linenos .normal { color: inherit; background-color: transparent; padding-left: 5px; padding-right: 5px; }
.notebookcellhtml span.linenos { color: inherit; background-color: transparent; padding-left: 5px; padding-right: 5px; }
.notebookcellhtml td.linenos .special { color: #000000; background-color: #ffffc0; padding-left: 5px; padding-right: 5px; }
.notebookcellhtml span.linenos.special { color: #000000; background-color: #ffffc0; padding-left: 5px; padding-right: 5px; }
.notebookcellhtml .highlight .hll { background-color: var(--jp-cell-editor-active-background) }
.notebookcellhtml .highlight { background: var(--jp-cell-editor-background); color: var(--jp-mirror-editor-variable-color) }
.notebookcellhtml .highlight .c { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment */
.notebookcellhtml .highlight .err { color: var(--jp-mirror-editor-error-color) } /* Error */
.notebookcellhtml .highlight .k { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword */
.notebookcellhtml .highlight .o { color: var(--jp-mirror-editor-operator-color); font-weight: bold } /* Operator */
.notebookcellhtml .highlight .p { color: var(--jp-mirror-editor-punctuation-color) } /* Punctuation */
.notebookcellhtml .highlight .ch { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment.Hashbang */
.notebookcellhtml .highlight .cm { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment.Multiline */
.notebookcellhtml .highlight .cp { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment.Preproc */
.notebookcellhtml .highlight .cpf { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment.PreprocFile */
.notebookcellhtml .highlight .c1 { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment.Single */
.notebookcellhtml .highlight .cs { color: var(--jp-mirror-editor-comment-color); font-style: italic } /* Comment.Special */
.notebookcellhtml .highlight .kc { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword.Constant */
.notebookcellhtml .highlight .kd { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword.Declaration */
.notebookcellhtml .highlight .kn { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword.Namespace */
.notebookcellhtml .highlight .kp { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword.Pseudo */
.notebookcellhtml .highlight .kr { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword.Reserved */
.notebookcellhtml .highlight .kt { color: var(--jp-mirror-editor-keyword-color); font-weight: bold } /* Keyword.Type */
.notebookcellhtml .highlight .m { color: var(--jp-mirror-editor-number-color) } /* Literal.Number */
.notebookcellhtml .highlight .s { color: var(--jp-mirror-editor-string-color) } /* Literal.String */
.notebookcellhtml .highlight .ow { color: var(--jp-mirror-editor-operator-color); font-weight: bold } /* Operator.Word */
.notebookcellhtml .highlight .w { color: var(--jp-mirror-editor-variable-color) } /* Text.Whitespace */
.notebookcellhtml .highlight .mb { color: var(--jp-mirror-editor-number-color) } /* Literal.Number.Bin */
.notebookcellhtml .highlight .mf { color: var(--jp-mirror-editor-number-color) } /* Literal.Number.Float */
.notebookcellhtml .highlight .mh { color: var(--jp-mirror-editor-number-color) } /* Literal.Number.Hex */
.notebookcellhtml .highlight .mi { color: var(--jp-mirror-editor-number-color) } /* Literal.Number.Integer */
.notebookcellhtml .highlight .mo { color: var(--jp-mirror-editor-number-color) } /* Literal.Number.Oct */
.notebookcellhtml .highlight .sa { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Affix */
.notebookcellhtml .highlight .sb { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Backtick */
.notebookcellhtml .highlight .sc { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Char */
.notebookcellhtml .highlight .dl { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Delimiter */
.notebookcellhtml .highlight .sd { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Doc */
.notebookcellhtml .highlight .s2 { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Double */
.notebookcellhtml .highlight .se { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Escape */
.notebookcellhtml .highlight .sh { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Heredoc */
.notebookcellhtml .highlight .si { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Interpol */
.notebookcellhtml .highlight .sx { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Other */
.notebookcellhtml .highlight .sr { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Regex */
.notebookcellhtml .highlight .s1 { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Single */
.notebookcellhtml .highlight .ss { color: var(--jp-mirror-editor-string-color) } /* Literal.String.Symbol */
.notebookcellhtml .highlight .il { color: var(--jp-mirror-editor-number-color) } /* Literal.Number.Integer.Long */

/* Input field styles */
.notebookcellhtml {
  --jp-input-box-shadow: inset 0 0 2px var(--md-blue-300);
  --jp-input-active-background: var(--jp-layout-color1);
  --jp-input-hover-background: var(--jp-layout-color1);
  --jp-input-background: var(--md-grey-100);
  --jp-input-border-color: var(--jp-border-color1);
  --jp-input-active-border-color: var(--jp-brand-color1);
  --jp-input-active-box-shadow-color: rgba(19, 124, 189, 0.3);

  /* General editor styles */

  --jp-editor-selected-background: #d9d9d9;
  --jp-editor-selected-focused-background: #d7d4f0;
  --jp-editor-cursor-color: var(--jp-ui-font-color0);

  /* Code mirror specific styles */

  --jp-mirror-editor-keyword-color: #008000;
  --jp-mirror-editor-atom-color: #88f;
  --jp-mirror-editor-number-color: #080;
  --jp-mirror-editor-def-color: #00f;
  --jp-mirror-editor-variable-color: var(--md-grey-900);
  --jp-mirror-editor-variable-2-color: #05a;
  --jp-mirror-editor-variable-3-color: #085;
  --jp-mirror-editor-punctuation-color: #05a;
  --jp-mirror-editor-property-color: #05a;
  --jp-mirror-editor-operator-color: #aa22ff;
  --jp-mirror-editor-comment-color: #408080;
  --jp-mirror-editor-string-color: #ba2121;
  --jp-mirror-editor-string-2-color: #708;
  --jp-mirror-editor-meta-color: #aa22ff;
  --jp-mirror-editor-qualifier-color: #555;
  --jp-mirror-editor-builtin-color: #008000;
  --jp-mirror-editor-bracket-color: #997;
  --jp-mirror-editor-tag-color: #170;
  --jp-mirror-editor-attribute-color: #00c;
  --jp-mirror-editor-header-color: blue;
  --jp-mirror-editor-quote-color: #090;
  --jp-mirror-editor-link-color: #00c;
  --jp-mirror-editor-error-color: #f00;
  --jp-mirror-editor-hr-color: #999;
}
</style>
