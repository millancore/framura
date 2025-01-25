<template>
  <div class="container" v-if="resource.id">
    <div class="source">
      <h2>{{ resource.title }}</h2>
      <Youtube v-if="resource.url" :video-url="resource.url"/>
    </div>
    <div class="notes">
      <QuillEditor :resource-id="resource.id"/>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue';
import Youtube from "./Youtube.vue";
import {resourceApi} from "../Api";
import QuillEditor from "./Editor.vue";
import EventBus from "../EventBus";

const resourceId = ref(null);
const resource = ref({});

const props = defineProps({
   entityId: Number
})

onMounted(() => {
   resourceId.value = props.entityId;
})

watch(resourceId, () => {
  getResource();
  EventBus.emit('resource-loaded', resourceId.value)
})

/**
 * Load Resource
 */
EventBus.on('load-resource', (id) => {
  resourceId.value = id;
})

/**
 *  If resource was update form sidebar refresh
 */
EventBus.on('resource-updated', (resource) => {
  if (resourceId.value === resource.id) {
    getResource();
  }
})

/** If the Current Resource was deleted */
EventBus.on('resource-deleted', (resource) => {
  if (resourceId.value === resource.id) {
    EventBus.emit('load-topic', resource.topic_id)
  }
})

async function getResource() {
  resource.value = await resourceApi.get(resourceId.value);
}

</script>

<style scoped>

.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-left: 16px;
  margin-top: 8px;
  margin-right: 4px;
  gap: 12px;
}

.source {
  width: 50%;
  background: #FAFAFA;
  padding: 12px 16px;
  border-radius: 6px 3px 3px 6px;
}

.source h2 {
  margin: 12px 0;
  color: #4B5563;
}

.notes {
  width: 50%;
  background: #FAFAFA;
  padding: 12px 16px;
  border-radius: 3px 6px 6px 3px;
}

</style>
