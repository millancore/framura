<template>
  <li class="topic-item">
    <button class="topic-title" @click="handleClick(topic.id)"> {{ topic.title }}</button>
    <ul class="resource-list" v-if="resources.length">
      <li class="resource" @click="getResource(resource.id)" v-for="resource in resources" :key="resource.id">
        {{ resource.title }}
      </li>
    </ul>
  </li>
</template>

<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({
  topic: Object
})

const resources = ref([])

const emit = defineEmits(['topicSelected', 'requestResource'])

onMounted(getResources)

async function getResources() {
   resources.value =  await api.getResourcesByTopic(props.topic.id)
}

function handleClick(topicId) {
   emit('topicSelected', topicId)
}

function getResource(resourceId) {
  emit('requestResource', resourceId)
}

</script>

<style scoped>

.topic-item {
  margin-top: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.topic-title {
  text-transform: uppercase;
  color: #374151;
  font-weight: bold;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resource {
  cursor: pointer;
  padding: 2px 4px;
  margin: 4px 0;

}

.resource:before {
   content: '';
   margin-right: 8px;
}

.resource:hover {
  background-color: #CBD5E1;
  padding: 4px 0;
  border-right: 2px solid #007BFF;
}




button {
  all: unset;
  cursor: pointer;
}

</style>