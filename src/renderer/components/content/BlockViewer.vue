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
  content: String
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
  blockViewer.render(JSON.parse(props.content));
}
</script>

<style scoped>

</style>