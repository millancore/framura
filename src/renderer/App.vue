<template>
  <div class="container">
    <div class="sidebar">
      <!-- <form class="topic-form" @submit.prevent="addTopic">
        <h2>Add Topic </h2>
        <input type="text" id="title" v-model="newTopic.title" required/>

      </form> -->

      <h2 class="title">Topics List</h2>
      <TopicList
          :reload="events"
          @topic-selected="onTopicSelected"
          @load-resource="currentResource = $event"

      />
    </div>
    <Resource />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import EventBus from "./EventBus";
import TopicList from "./components/TopicList.vue";
import Resource from "./components/Resource.vue";

const events = ref(0)
const newTopic = ref({
  title: "",
})

const currentTopic = ref(null)
const currentResource = ref(null)


function onResourceSelected(resourceId) {
  currentResource.value = resourceId;
}

const addTopic = async () => {
  const response = await api.createTopic(newTopic.value.title);

  console.log(response);

  if (response.success) {
    newTopic.value.title = ""; // Reset the input field after successfully adding a topic
    events.value++
  }
}

function onTopicSelected(topicId) {
  currentTopic.value = topicId;
  currentResource.value = null;
}


</script>


<style scoped>

.container {
  display: flex;
  background: #CBD5E1;
  padding: 0;
  margin: 0;
  height: calc(100vh - 8px);
}

.sidebar {
  background: #FAFAFA;
  padding-left: 8px;
  width: 250px;
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