<template>
  <div class="youtube-embed">
    <iframe id="player" :src="embedUrl" allowfullscreen></iframe>

    <button
        class="timestamp-add"
        v-if="canCreateMarks"
        @click="addTimestamp">
      <ClockIcon class="clock-icon"/>
     Capture
    </button>

    <div class="timestamp-container">
    <ul class="timestamps-list" v-if="timestamps.length">
      <li class="timestamp" v-for="timestamp in timestamps" :key="timestamp.mark">
        <button @click="seekTo(timestamp.mark)">{{ timestamp.text }}</button>
        <form @submit.prevent="updateTimestamp(timestamp.id)">
          <input
              id="timestamp-text"
              v-model="timestamp.title"
              type="text"
              placeholder="Add tex"
          />
        </form>
        <Trash2Icon class="trash-icon"/>
      </li>
    </ul>
    </div>
  </div>


</template>

<script setup>

import {computed, onMounted, ref, watch, toRef, nextTick} from 'vue'
import { ClockIcon, Trash2Icon } from 'lucide-vue-next'
import {MarkApi} from '@renderer/Api'

const player = ref(null)
const timestamps = ref([])
const canCreateMarks = ref(false)

const props = defineProps({
  videoUrl: String
})

const url = toRef(props, 'videoUrl');

onMounted(() => {
  loadYoutubeIframeAPI();
  nextTick(() => {
     canCreateMarks.value = true;
  });
})

watch(url, () => {
  timestamps.value = [];
})

const videoId = computed(() => {
  return props.videoUrl?.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]?.*)/)?.[1] || null;
})

const embedUrl = computed(() => {
  return videoId.value
      ? `https://www.youtube.com/embed/${videoId.value}?enablejsapi=1`
      : null;
})

async function addTimestamp() {

  const time = player.value.getCurrentTime();

  timestamps.value.push({
    text: `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`,
    mark: time
  })

}

function loadYoutubeIframeAPI() {
  if (!window.YT) {
    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {

      player.value = new YT.Player('player', {
        videoId: videoId.value,
        events: {
          'onReady': onReady
        }
      });
    }
  }
}

function seekTo(seconds) {
  player.value.seekTo(seconds);
}

function onReady(event) {
  canCreateMarks.value = true
}


</script>

<style>

.youtube-embed iframe {

  width: 99.7%;
  aspect-ratio: 16/9;
}

.timestamp-container {
  overflow-y: auto;
  max-height: 50vh;
}

.timestamp-add {
  display: flex;
  align-items: center;
  background-color: #64748B;
  color: white;
  border-radius: 0;
  border: none;
  margin-left: 5px;

  &:hover {
    background-color: var(--primary-color);
  }
}

.clock-icon {
  width: 1.5rem;
  margin-right: 0.5rem;
}

.trash-icon {
  display: none;
  width: 1.5rem;
  margin-left: 2px;
  padding: 0.4rem;
  color: rgba(248, 113, 113, 0.47);
  cursor: pointer;
}

.trash-icon:hover {
  color: #F87171;
}

.timestamps-list {
  list-style: none;
  padding-left: 1.5rem;
}

.timestamp {
  display: flex;
  align-items: center;
}

.timestamp:hover button {
  background-color: #3b82f6;
}

.timestamp:hover .trash-icon {
  display: block;
}

.timestamp:hover input {
  border-bottom: 1px solid #3b82f6;
}

.timestamp button {
  background-color: #CBD5E1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    color: white;
  }
}

.timestamp input {
  border: none;
  border-radius: 0;
  background: none;
  padding: 0.5rem 1rem;
}

</style>
