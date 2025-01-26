<template>
  <div class="topic-container">
    <h1>{{ topic.title }}</h1>

    <h3>Add Resource</h3>
    <form  @submit.prevent="createResource">
    <div class="form-item">
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="newResource.title" required/>
    </div>
    <div class="form-item">
      <label for="url">YouTube:</label>
      <input
          @keydown="error = false"
          id="url"
          type="url"
          v-model="newResource.url"
          required
      />
    </div>
      <p v-show="error" class="error">Please enter a valid YouTube URL</p>
    <button type="submit">Add</button>
  </form>

    <div class="notes">
      <h3>Notes:</h3>


    </div>

  </div>
</template>

<script setup>
import {ref, onMounted, watch, toRef } from 'vue'
import { resourceApi, topicApi } from "../Api";
import EventBus from "../EventBus";

const error = ref(false);
const topic = ref({});
const newResource = ref({
  title: '',
  url: ''
});

const props = defineProps({
  entityId: Number
})

const topicId = toRef(props, 'entityId');

onMounted(() => {
   getTopic();
})

watch(topicId, () => {
  getTopic();
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
    EventBus.emit('load-resource', result.lastInsertRowid);
    EventBus.emit('sidebar.topic.refresh', props.entityId);
  }
}

async function getTopic() {
    topic.value = await topicApi.get(props.entityId);
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
  padding: 1rem;
}

h1, h3 {
  margin: 0;
}

h1 {
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.form-item label {
  width: 90px;
  background: var(--background-color);
  padding: 0.5rem;
  border-radius: 3px;
}

.error {
  color: #F43F5E;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}

.notes {
  margin-top: 2rem;
}

</style>