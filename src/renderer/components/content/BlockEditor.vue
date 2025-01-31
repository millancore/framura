<template>
  <div id="editor-container">
    <div id="editorjs" class="editor" ref="container"><!-- --></div>
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
  resourceId: Number
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
  let content = await resourceApi.notes(props.resourceId)

  if (content.notes === '') {
     content.notes = '{}';
  }

  editor.render(JSON.parse(content.notes));
}

function UpdateNotes(api, event) {
  editor.save().then((outputData) => {
    resourceApi.updateNotes(props.resourceId, JSON.stringify(outputData))
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
  height: 100vh;
}

.editor {

  background-color: #f8f8ec;
  color: #333;
  padding-left: 16px;
  padding-top: 16px;
  border-radius: 5px;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  min-height: 97%;
}








</style>