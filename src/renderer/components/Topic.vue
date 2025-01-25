<template>
  <div class="topic-container">
    <form  @submit.prevent="createResource">
    <div>
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="newResource.title" required/>
    </div>
    <div>
      <label for="url">YouTube URL</label>
      <input
          @keydown="error = false"
          type="url"
          v-model="newResource.url"
          required
      />
      <p v-show="error" class="error">Please enter a valid YouTube URL</p>
    </div>
    <button type="submit">Add</button>
  </form>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { resourceApi } from "../Api";
import EventBus from "../EventBus";

const error = ref(false);
const newResource = ref({
  title: '',
  url: ''
});

const props = defineProps({
  entityId: Number
})

async function createResource() {

  if(!validateYoutubeUrl()) {
    error.value = true;
    return;
  }

  const {title, url} = newResource.value;
  const topicId = props.entityId;

  const result = await resourceApi.create({
    topicId, title, url,
  });

  if(result.changes) {
    EventBus.emit('resource-created', props.entityId);
    EventBus.emit('load-resource', result.lastInsertRowid);
  }

}

function validateYoutubeUrl() {
  const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return youtubeUrlRegex.test(newResource.value.url);
}


</script>

<style scoped>

.topic-container {
  width: 100%;
  background: #FAFAFA;
  border-radius: 6px;
  height: 100%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  padding: 1rem;
}

form div {
  display: flex;
  flex-direction: column;
}

form label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

form input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

form input:focus {
  border-color: #609afa;
}

form button {
  padding: 0.7rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #3b82f6;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #2570eb;
}

.error {
  color: #F43F5E;
  font-weight: 600;
  font-size: 0.9rem;
}

</style>