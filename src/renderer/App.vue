<template>
  <div class="container">
    <Sidebar :reload="events"/>

    <div class="resource-container">
      <component :is="currentComponent" :entity-id="entityId"/>
    </div>

  </div>
</template>

<script setup>
import {ref, shallowRef} from 'vue'
import EventBus from "./EventBus";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Resource from "./components/content/Resource.vue";
import Topic from "./components/Topic.vue";
import Init from "./components/Init.vue";

const events = ref(0)
const entityId = ref(null);

const currentComponent = shallowRef(Init)

/*
 * Load Resource Component
 */
EventBus.on('load-resource', (resourceId) => {
  currentComponent.value = Resource;
  entityId.value = resourceId;
})

/**
 * Load Topic Component
 */
EventBus.on('new-resource', (topicId) => {
  currentComponent.value = Topic;
  entityId.value = topicId;
})

EventBus.on('load-topic', (topicId) => {
  currentComponent.value = Topic;
  entityId.value = topicId;
})

EventBus.on('app.show.init', () => {
  currentComponent.value = Init;
  entityId.value = null;
})

</script>


<style scoped>
.container {
  display: flex;
  background: #CBD5E1;
  padding: 0;
  margin: 0;
  height: calc(100vh - 8px);
}

.resource-container {
  width: 100%;
  margin-left: 16px;
  margin-top: 8px;
  margin-right: 4px;
  gap: 12px;
}


.title {
  color: #64748B;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.topic-form input {
  margin: 2px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.topic-form h2 {
  text-transform: uppercase;
  margin: 0;
  font-size: 0.95rem;
  display: block;
  color: #64748B
}

.topic-form input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}


</style>