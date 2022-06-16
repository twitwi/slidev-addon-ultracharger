<template>
  <footer
    v-if="$slidev.nav.currentLayout !== 'cover'"
    class="absolute bottom-0 text-center left-0 right-0 px-2 py-0 text-xs"
      >
      <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="icon-btn opacity-20 !border-none !hover:text-white p-0">
          <carbon:edit />
      </button>
      {{ "date author".split(" ").map(k => $slidev.configs[k]).join(" − ") }}
      − 
      {{ $slidev.nav.currentPage }} / {{ $slidev.nav.total+1 }}
  </footer>

  <AutoPlay />
  <!--TocNG mode="allDots" :max-depth="1" class="absolute bottom-0 right-5"/-->
  <TOC mode="dots" class="absolute bottom-0 right-5"/>
  <Blackout/>
</template>
