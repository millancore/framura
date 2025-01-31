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
        <button @click="seekTo(timestamp.mark)">{{ timestamp.button }}</button>
        <form @submit.prevent="updateTitle(timestamp)">
          <input
              @focusout="updateTitle(timestamp)"
              id="timestamp-text"
              v-model="timestamp.title"
              type="text"
              placeholder="Add tex"
          />
        </form>
        <Trash2Icon @click="deleteTimestamp(timestamp.id)" class="trash-icon"/>
      </li>
    </ul>
    </div>
  </div>


</template>

<script setup>

import {computed, onMounted, ref, watch, toRef, nextTick} from 'vue'
import { ClockIcon, Trash2Icon } from 'lucide-vue-next'
import {markApi} from '@renderer/Api'

const player = ref(null)
const timestamps = ref([])
const canCreateMarks = ref(false)

const props = defineProps({
  url: String,
  resourceId: Number,
})

const watchResourceId = toRef(props, 'resourceId')

onMounted(() => {
  loadYoutubeIframeAPI();
  nextTick(() => {
     canCreateMarks.value = true;
  });
})

watch(watchResourceId, () => {
  loadMarks()
})


const videoId = computed(() => {
  return props.url?.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]?.*)/)?.[1] || null;
})

const embedUrl = computed(() => {
  return videoId.value
      ? `https://www.youtube.com/embed/${videoId.value}?enablejsapi=1`
      : null;
})

async function addTimestamp() {

  const time = player.value.getCurrentTime();

  const timestamp = {
    resource_id: props.resourceId,
    mark: time,
    type: 'youtube',
    title: ''
  };

  await markApi.create(timestamp)
  await loadMarks()
}

async function loadMarks() {
  let marks  = await markApi.getByResource(props.resourceId)

  timestamps.value = marks.map((mark) => ({
    id: mark.id,
    title: mark.title,
    mark: mark.mark,
    button: `${Math.floor(mark.mark / 60)}:${String(Math.floor(mark.mark % 60)).padStart(2, '0')}`
  }));
  
  canCreateMarks.value = true;
}

async function updateTitle(timestamp) {
  await markApi.updateTitle(timestamp.id, timestamp.title)
  await loadMarks()
}

async function deleteTimestamp(id) {
  await markApi.delete(id)
  await loadMarks()
}

function initPlayer() {
  if (!videoId.value) {
    console.error("Video ID is missing. Cannot initialize the player.");
    return;
  }

  player.value = new YT.Player('player', {
    videoId: videoId.value,
    events: {
      'onReady': onReady,
    }
  });
}


function loadYoutubeIframeAPI() {
  if (window.YT) {
    // API is already loaded. Initialize the player directly.
    initPlayer()
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.getElementsByTagName('script')[0].parentNode.insertBefore(script, document.getElementsByTagName('script')[0]);

  window.onYouTubeIframeAPIReady = () => {
    initPlayer();
  };
}

function seekTo(seconds) {
  player.value.seekTo(seconds);
}

async function onReady(event) {
  await loadMarks()
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
    background-color: #64748B;
    font-weight: 600;
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

.timestamp:hover .trash-icon {
  display: block;
}

.timestamp:hover input {
  border-bottom: 1px solid #3b82f6;
}

.timestamp button {
  background-color: #CBD5E1;
  color: #1E293B;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: white;
    font-weight: 600;
  }
}

.timestamp input {
  border: none;
  border-radius: 0;
  background: none;
  padding: 0.5rem 1rem;
}

</style>
