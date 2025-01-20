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

const newResource = ref({
  title: '',
  url: '',
});

const resource = ref({});

const props = defineProps({
  topic: {
    type: [Number, null],
  },
  resourceId: {
    type: [Number, null],
  },
})

watch(() => props.resourceId, () => {
  if (props.resourceId !== null) {
    getResource();
  }
})

async function getResource() {
   resource.value = await api.getResource(props.resourceId);
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
     justify-content: center;
     margin: 8px 16px;
     gap: 16px;
  }

  .source {
    width: 50%;
    background: white;
    padding: 12px 16px;
    border-radius: 6px;
  }

  .source h2 {
     margin: 12px 0;
     color: #4B5563;
  }

  .notes {
    width: 50%;
    background: white;
    padding: 12px 16px;
    border-radius: 6px;
  }

</style>
