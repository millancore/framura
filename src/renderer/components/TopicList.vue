<template>
  <ul class="topic-list">
    <TopicItem
        v-for="topic in topics"
        :key="topic.id"
        :topic="topic"
        @topic-selected="loadTopic"
        @request-resource="loadResource"
    />
  </ul>
</template>

<script setup>

import {ref, defineProps, onMounted, watch} from 'vue'
import TopicItem from "./TopicItem.vue";
import {topicApi} from "../Api";
import EventBus from "../EventBus";

const emit = defineEmits(['topicSelected', 'loadResource']);

const props = defineProps({
    reload: 0
})

const topics = ref([])

async function getTopics() {
  topics.value = await topicApi.all()
}

EventBus.on('sidebarReload', () => {
    topics.value = []
    getTopics()
})


function loadResource(resourceId) {
   emit('loadResource', resourceId)
}

function loadTopic(topicId) {
    emit('topicSelected', topicId)
}


onMounted(getTopics)
</script>

<style scoped>
  .topic-list {
    list-style: none;
    padding: 0;
  }


</style>