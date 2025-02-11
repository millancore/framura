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
import LaTex from 'editorjs-math'
import {resourceApi} from "@renderer/Api";

const container = ref(null);

const props = defineProps({
  resourceId: String,
  readOnly: {
    type: Boolean,
    default: false
  }
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

  if(!props.resourceId) return;

  let notes = await resourceApi.notes(props.resourceId)

  if (notes && Object.keys(notes).length > 0) {
    editor.render(notes);
  }
}

function UpdateNotes(api, event) {

  if(props.readOnly) return;

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
    readOnly: props.readOnly,
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
      math: LaTex
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