<template>
  <li class="topic-item" :class="{'selected': active}">
    <a class="topic-title" @click="showResource()"> {{ topic.title }}</a>
    <ul class="resource-list">
      <ResourceItem
          :resource="resource"
          v-for="resource in resources"
          :key="resource.id"
          @reloadResources="getResources"
      />
      <li @click="newResource" class="add-resource">
        <PlusIcon class="add-icon" size="16" />
        <span>Add new</span>
      </li>
    </ul>
  </li>
</template>

<script setup>

import {onMounted, ref} from 'vue'
import ResourceItem from "./ResourceItem.vue";
import {resourceApi} from "@renderer/Api";
import EventBus from "@renderer/EventBus";
import {PlusIcon} from 'lucide-vue-next'

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

function showResource() {
  localStorage.setItem('lastTopicId', props.topic.id)
  EventBus.emit('load-topic', props.topic.id)
}

function newResource() {
  EventBus.emit('modal.resource', props.topic.id)
}
</script>

<style scoped>

.topic-item {
  margin-top: 16px;
  padding-bottom: 8px;
}

.topic-title {
  color: #1E293B;
  cursor: pointer;
  display: block;
}

.topic-title:hover {
  font-weight: 600;
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

.add-resource {
  margin-top: 4px;
  margin-left: 12px;
  display: flex;
  justify-content: start;
  align-items: center;
  cursor: pointer;
}

.add-resource:hover  span {
  color: #475569
}

.add-resource span {
  font-size: 0.8rem;
  margin-left: 4px;
  color: #64748B;
}

.add-icon {
  color: #64748B;
  cursor: pointer;
  border-radius: 3px;
}

</style>