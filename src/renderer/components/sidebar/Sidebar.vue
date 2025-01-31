<template>
  <div v-if="!toggle" class="min-sidebar">
    <SidebarIcon @click="toggleSidebar" class="sidebar-icon"/>
    <SquarePenIcon @click="showInit" class="mini-home-icon"/>
  </div>
  <div v-if="toggle" class="sidebar">
    <div class="toggle-sidebar">
      <SidebarIcon @click="toggleSidebar" class="sidebar-icon"/>
    </div>
    <div @click="showInit" class="sidebar-header">
      New Topic
      <SquarePenIcon class="home-icon"/>
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
import {SidebarIcon, SquarePenIcon} from 'lucide-vue-next'

const topics = ref([])
const toggle = ref(true)

onMounted(getTopics)

EventBus.on('reload-sidebar', () => {
  topics.value = []
  getTopics()
})

function showInit() {
  EventBus.emit('app.show.init')
}


function toggleSidebar() {
  toggle.value = !toggle.value;
}


async function getTopics() {
  topics.value = await topicApi.all()
}
</script>

<style scoped>
.min-sidebar {
  background: #FAFAFA;
  width: 36px;
  min-height: 100vh;
  padding-left: 8px;
}

.sidebar {
  background: #FAFAFA;
  padding-left: 8px;
  width: 250px;
  overflow-y: auto;
  height: 100vh;
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  cursor: pointer;
}

.sidebar-header:hover {
  color: #0F172A;
  font-weight: 600;
}

.toggle-sidebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-sidebar span {
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
}

.sidebar-icon {
  cursor: pointer;
  color: #374151;
  margin-top: 6px;
}

.mini-home-icon {
  margin-top: 12px;
}

.home-icon {
  width: 2rem;
  cursor: pointer;
  color: #374151;
}

.home-icon:hover {
  color: #161e2e;
}

.topic-list {
  list-style: none;
  padding: 0;
}
</style>