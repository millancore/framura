<template>
  <div id="editor-container">
    <div id="editorjs" ref="container"><!-- --></div>
  </div>
</template>

<script setup>

import {onMounted, onUnmounted, ref, watch} from 'vue'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import {resourceApi} from "@renderer/Api";

const container = ref(null);

const props = defineProps({
  resourceId: String
})

let editor;

onMounted(initEditor)

onUnmounted(() => {
  editor.destroy();
})

watch(() => props.resourceId, () => {
    editor.clear();
    loadNotes();
})

async function loadNotes() {
  let notes = await resourceApi.notes(props.resourceId)

  if (notes && Object.keys(notes).length > 0) {
    editor.render(notes);
  }
}

function UpdateNotes(api, event) {
  editor.save().then((outputData) => {
    resourceApi.updateNotes(props.resourceId, outputData)
  }).catch((error) => {
    console.log('Saving failed: ', error)
  })
}

function initEditor() {
  editor = new EditorJS({
    holder: 'editorjs',
    placeholder: 'Start typing here or use "/"',
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a header',
          levels: [1, 2, 3, 4],
        }
      },
      list: List,
      delimiter: Delimiter,
      table: Table,
    },
    onReady: loadNotes,
    onChange: UpdateNotes,
  })
}
</script>

<style scoped>

#editor-container {
  overflow-y: auto;
  border-radius: 2px;
  max-height: 100vh;
}

#editorjs {
  background-color: #f8f8ec;
  color: #333;
  padding-left: 16px;
  padding-top: 16px;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  min-height: calc(100vh - 20px);
}
</style>