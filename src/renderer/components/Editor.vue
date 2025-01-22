<template>
  <div class="editor">
    <div ref="editorContainer"></div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {resourceApi} from "../Api";
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import the Quill CSS style

const editorContainer = ref(null);
const quill = ref(null);
const fontSize = '20px';

const props = defineProps({
   resourceId: Number
})

onMounted(initQuill)

watch(() => props.resourceId, async () => {
     const notes = await getNotes();
     quill.value.root.innerHTML = notes.notes
})

async function initQuill() {

  const notes = await getNotes();

  quill.value = new Quill(editorContainer.value, {
    theme: 'snow',
    placeholder: 'Start typing here...',
    modules: {
      toolbar: [
        [{header: [1, 2, 3, false]}],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['clean'], // Remove formatting button
      ],
    },
  });

  if (notes.notes !== '') {
     quill.value.root.innerHTML = notes.notes;
  }

  quill.value.on('text-change', () => {
    saveEditorContent()
  })
}

async function getNotes() {
   return await resourceApi.notes(props.resourceId)
}

async function saveEditorContent() {
  await resourceApi.updateNotes(props.resourceId, quill.value.root.innerHTML)
}

</script>

<style scoped>

.editor {
  height: 95%;
}

.ql-container {
  background-color: #fff;
  box-sizing: border-box;
  font-size: v-bind(fontSize);
}


</style>