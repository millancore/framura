<template>
  <form v-if="topic && resourceId == null" @submit.prevent="createResource">
    <div>
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="newResource.title" required/>
    </div>
    <div>
      <label for="url">YouTube URL</label>
      <input type="url" id="url" v-model="newResource.url" required/>
    </div>
    <button type="submit">Submit</button>
  </form>

  <div class="container" v-if="resourceId">
    <div class="source">
      <h2>{{resource.title}}</h2>
      <Youtube v-if="resource.url" :video-url="resource.url"/>
    </div>
    <div class="notes">
      <QuillEditor :resource-id="resourceId" />
    </div>
  </div>


</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import Youtube from "./Youtube.vue";
import QuillEditor from "./Editor.vue";
import {resourceApi, resourceApi as api} from "../Api";
import EventBus from "../EventBus";

const newResource = ref({
  title: '',
  url: '',
});

const topic = ref(null);
const resourceId = ref(null);

const resource = ref({});

EventBus.on('loadResource', (resource) => {
   resourceId.value = resource;
})

watch(() => resourceId.value, () => {
    getResource();
})

async function getResource() {
   resource.value = await resourceApi.get(resourceId.value)
}


async function createResource() {
    const {title, url} = newResource.value;
    const res = await api.createResource(props.topic,{title, url});
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
