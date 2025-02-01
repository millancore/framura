<template>
  <transition name="mini-fade">
    <div v-if="miniSidebar" class="min-sidebar">
      <div>
        <SidebarIcon @click="toggleSidebar" class="sidebar-icon icon"/>
        <SquarePenIcon @click="showInit" class="mini-home-icon icon"/>
      </div>
      <NotepadTextIcon v-if="showNotebook" @click="lastResource" class="notebook-icon icon"/>
      <ArchiveIcon @click="showArchive" class="archive-icon icon"/>
    </div>
  </transition>
  <transition name="fade">
    <div v-if="!miniSidebar" class="sidebar">
      <div class="header">
        <div class="toggle-sidebar">
          <SidebarIcon @click="toggleSidebar" class="sidebar-icon icon"/>
        </div>
        <div @click="showInit" class="sidebar-header">
          New Topic
          <SquarePenIcon class="home-icon icon"/>
        </div>
      </div>
      <ul class="topic-list">
        <TopicItem
            v-for="topic in topics"
            :key="topic.id"
            :topic="topic"
        />
      </ul>
      <div class="archive">
        <span>Archive</span>
        <ArchiveIcon/>
      </div>
    </div>
  </transition>
</template>

<script setup>

import {computed, onMounted, ref} from 'vue'
import TopicItem from "./TopicItem.vue";
import {topicApi} from "@renderer/Api";
import EventBus from "@renderer/EventBus";
import {ArchiveIcon, NotepadTextIcon, SidebarIcon, SquarePenIcon} from 'lucide-vue-next'

const topics = ref([])
const miniSidebar = ref(false)

onMounted(() => {
  getTopics();
  miniSidebar.value = localStorage.getItem('miniSidebar') === 'true';
})

EventBus.on('reload-sidebar', () => {
  topics.value = []
  getTopics()
})

const showNotebook = computed(() => {
  return localStorage.hasOwnProperty('lastResourceId')
})

function showInit() {
  EventBus.emit('app.show.init')
}

function toggleSidebar() {
  miniSidebar.value = !miniSidebar.value;
  localStorage.setItem('miniSidebar', miniSidebar.value);
}

async function getTopics() {
  topics.value = await topicApi.all()
}

function lastResource() {
  let resource = localStorage.getItem('lastResourceId');
  EventBus.emit('load-resource', resource)
}

</script>

<style scoped>
.min-sidebar {
  display: flex;
  flex-direction: column;
  background: #FAFAFA;
  min-height: 100vh;
  width: 36px;
  padding-left: 8px;
  justify-content: space-between;
}

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #FAFAFA;
  padding-left: 8px;
  width: 250px;
  overflow-y: auto;
  height: 100vh
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  padding-bottom: 10px;
  cursor: pointer;
  border-bottom: 1px solid #E2E8F0;
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

.icon {
  width: 2rem;
  color: #374151;
  cursor: pointer;
}

.sidebar-icon {
  cursor: pointer;
  color: #374151;
  margin-top: 12px;
}

.mini-home-icon {
  margin-top: 12px;
}

.mini-home-icon:hover {
  color: #161e2e;
  margin-left: 2px;
}

.home-icon:hover {
  color: #161e2e;
}

.topic-list {
  list-style: none;
  padding: 0;
  margin-top: 0;
  min-height: 80%;
  overflow-y: auto;
}

.archive {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #FAFAFA;
  padding: 10px 0;
  border-top: 1px solid #E2E8F0;
  cursor: pointer;
  color: #374151;
}

.archive-icon {
  padding: 10px 0;
  color: #374151;
}

.notebook-icon {
  background: #dbe8fe;
  margin-left: -4px;
  padding: 4px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}



.fade-enter-active,
.fade-leave-active {
  transition: all 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  margin-left: -250px;
  opacity: 0;
}

.mini-fade-enter-active,
.mini-fade-leave-active {
  transition: all 0.7s ease;
}

.mini-fade-enter-from,
.mini-fade-leave-to {
  opacity: 0;
  margin-left: -36px;
}


</style>