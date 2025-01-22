<template>
  <li class="topic-item">
    <a class="topic-title" @click="handleClick(topic.id)"> {{ topic.title }}</a>
    <ul class="resource-list" v-if="resources.length">
       <ResourceItem
           :resource="resource"
           v-for="resource in resources"
           :key="resource.id"
       />
    </ul>
  </li>
</template>

<script setup>

import {onMounted, ref } from 'vue'
import ResourceItem from "./ResourceItem.vue";
import {resourceApi} from "../Api";

const props = defineProps({
  topic: Object
})

const resources = ref([])
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};


const emit = defineEmits(['topicSelected', 'requestResource'])

onMounted(() => {
  getResources();
});


async function getResources() {
  resources.value = await resourceApi.getByTopic(props.topic.id)
}

function handleClick(topicId) {
   emit('topicSelected', topicId)
}



</script>

<style scoped>

.topic-item {
  margin-top: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.topic-title {
  color: #374151;
  font-weight: bold;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

button {
  cursor: pointer;
}

</style>