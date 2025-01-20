<template>
  <div class="youtube-embed">
    <iframe
        id="player"
        :src="embedUrl"
        allowfullscreen
    ></iframe>

    <button @click="addTimestamp">Add Timestamp</button>
    <ul>
      <li v-for="timestamp in timestamps" :key="timestamp.mark">
          <button @click="seekTo(timestamp.mark)">{{ timestamp.text }}</button>
      </li>
    </ul>
  </div>


</template>

<script setup>

import {ref, computed, defineProps, onMounted} from 'vue'

const player = ref(null)

const timestamps = ref([])

const newTimestamp = ref({})

const props = defineProps({
  videoUrl: String
})

const videoId = computed(() => {
  return new URL(props.videoUrl).searchParams.get("v");
})

const embedUrl = computed(() => {
  return videoId.value
      ? `https://www.youtube.com/embed/${videoId.value}?enablejsapi=1`
      : null;
})

function addTimestamp() {
  
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
          'onReady': onPlayerReady,
        }
      });
    }
  }
}

function seekTo(seconds) {
  player.value.seekTo(seconds);
}

function onPlayerReady(event) {
   console.log("onPlayerReady");
}


onMounted(loadYoutubeIframeAPI)

</script>

<style>

.youtube-embed iframe {
  width: 100%;
  aspect-ratio: 16/9;
}
</style>
