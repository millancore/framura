<template>
  <div class="topic-container">
    <h1>{{ topic.title }}</h1>
    <div class="notes">
      <h3>Notes:</h3>

    </div>

  </div>
</template>

<script setup>
import {ref, onMounted, watch, toRef } from 'vue'
import { resourceApi, topicApi } from "@renderer/Api";
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
  background: #FAFAFA;
  padding: 1rem;
}



</style>