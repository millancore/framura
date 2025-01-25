<template>
  <ul class="topic-list">
    <TopicItem
        v-for="topic in topics"
        :key="topic.id"
        :topic="topic"
    />
  </ul>
</template>

<script setup>

import {ref, defineProps, onMounted} from 'vue'
import TopicItem from "./TopicItem.vue";
import {topicApi} from "../Api";
import EventBus from "../EventBus";


const props = defineProps({
    reload: 0
})

const topics = ref([])

onMounted(getTopics)

async function getTopics() {
  topics.value = await topicApi.all()
}

EventBus.on('sidebarReload', () => {
    topics.value = []
    getTopics()
})


</script>

<style scoped>
  .topic-list {
    list-style: none;
    padding: 0;
  }


</style>