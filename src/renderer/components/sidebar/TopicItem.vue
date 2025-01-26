<template>
  <li class="topic-item" :class="{'selected': active}">
    <a class="topic-title" @click="newResource()"> {{ topic.title }}</a>
    <ul class="resource-list" v-if="resources.length">
      <ResourceItem
          :resource="resource"
          v-for="resource in resources"
          :key="resource.id"
          @reloadResources="getResources"
      />
    </ul>
  </li>
</template>

<script setup>

import {onMounted, ref} from 'vue'
import ResourceItem from "./ResourceItem.vue";
import {resourceApi} from "@renderer/Api";
import EventBus from "@renderer/EventBus";

const props = defineProps({
  topic: Object
})

const resources = ref([])
const active = ref(false)

onMounted(() => {
  getResources();
});

EventBus.on('sidebar.topic.refresh', (id) => {
  if (props.topic.id === id) {
    getResources();
  }
})

EventBus.on('new-resource', (id) => {
  active.value = false;
  if (props.topic.id === id) {
    active.value = true;
  }
})

async function getResources() {
  resources.value = await resourceApi.getByTopic(props.topic.id)
}

function newResource() {
  EventBus.emit('new-resource', props.topic.id)
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
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.selected .topic-title {
  color: #161e2e;
  font-weight: 600;
}

</style>