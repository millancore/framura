<template>
  <div class="sidebar">
    <div class="sidebar-header">
    <pencil-square-icon @click="showInit" class="home-icon"/>
    </div>
    <ul class="topic-list">
      <TopicItem
          v-for="topic in topics"
          :key="topic.id"
          :topic="topic"
      />
    </ul>
  </div>
</template>

<script setup>

import {onMounted, ref} from 'vue'
import TopicItem from "./TopicItem.vue";
import {topicApi} from "@renderer/Api";
import EventBus from "@renderer/EventBus";
import {PencilSquareIcon } from "@heroicons/vue/16/solid"

const topics = ref([])

onMounted(getTopics)

EventBus.on('reload-sidebar', () => {
  topics.value = []
  getTopics()
})

function showInit() {
  EventBus.emit('app.show.init')
}

async function getTopics() {
  topics.value = await topicApi.all()
}
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.home-icon {
  width: 2rem;
  cursor: pointer;
  color: #374151;
}

.home-icon:hover {
  color: #161e2e;
}

.sidebar {
  background: #FAFAFA;
  padding-left: 8px;
  width: 250px;
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #94A3B8;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #64748B;
}

.topic-list {
  list-style: none;
  padding: 0;
}
</style>