<template>
  <div id="viewer"></div>
</template>

<script setup>
import {onMounted, watch} from "vue";
import EditorJS from '@editorjs/editorjs';
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

let blockViewer;

const props = defineProps({
  content: Object
})

onMounted(initEditor)

watch(() => props.content, () => {
  loadContent();
})

function initEditor() {
  blockViewer = new EditorJS({
    holder: 'viewer',
    readOnly: true,
    tools: {
      header: Header,
      list: List,
      delimiter: Delimiter,
      table: Table
    }
  });
}

function loadContent() {

  if (props.content && Object.keys(props.content).length > 0) {
    blockViewer.render(props.content);
  }
}
</script>

<style scoped>

</style>