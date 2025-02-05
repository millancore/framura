<template>
  <div class="container">
    <!--- Sidebar -->
    <Sidebar />

    <!--- Components Main View --->
    <div class="resource-container">
      <component :is="currentComponent" :entity-id="entityId"/>
    </div>

    <!--- New Resource --->
    <NewResource />
  </div>
</template>

<script setup>
import {ref, shallowRef, onMounted} from 'vue'
import EventBus from "./EventBus";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Resource from "./components/content/Resource.vue";
import Topic from "./components/Topic.vue";
import Init from "./components/Init.vue";
import NewResource from "./components/NewResource.vue";
import Archive from "./components/Archive.vue";

const entityId = ref(null);

const currentComponent = shallowRef(Init)

onMounted(() => {
   let lastResourceId = localStorage.getItem('lastResourceId');

   if(lastResourceId) {
     currentComponent.value = Resource;
     entityId.value = lastResourceId;
   }
})

/*
 * Load Resource Component
 */
EventBus.on('load-resource', (resourceId) => {
  currentComponent.value = Resource;
  entityId.value = resourceId;

  localStorage.setItem('lastResourceId', resourceId);
})

EventBus.on('load-topic', (topicId) => {
  currentComponent.value = Topic;
  entityId.value = topicId;
})

EventBus.on('app.show.init', () => {
  currentComponent.value = Init;
  entityId.value = null;
})

EventBus.on('app.show.archive', () => {
  currentComponent.value = Archive;
})
</script>


<style scoped>
.container {
  display: flex;
  background: #CBD5E1;
  padding: 0;
  margin: 0;
}

.resource-container {
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 8px;
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