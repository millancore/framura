<template>
  <div v-if="isModalVisible"
       class="modal-overlay"
       @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">Add Resource</span>
        <XIcon class="close-icon" @click="closeModal"/>
      </div>
      <form @submit.prevent="createResource">
        <div class="form-item">
          <label for="title">Title:</label>
          <input
              type="text"
              id="title"
              v-model="resource.title"
              maxlength="30"
              required/>
        </div>
        <div class="form-item">
          <label for="url">YouTube URL:</label>
          <input
              @keydown="error = false"
              id="url"
              type="url"
              v-model="resource.url"
              required
          />
        </div>
        <p v-show="error" class="error">Please enter a valid YouTube URL</p>
        <button type="submit">Add</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {XIcon} from 'lucide-vue-next'
import EventBus from "../EventBus";
import {resourceApi} from "@renderer/Api";

const isModalVisible = ref(false);
const resource = ref({})
const error = ref(false);
const topicId = ref(null);

const closeModal = () => (isModalVisible.value = false);
const openModal = () => (isModalVisible.value = true);

EventBus.on('modal.resource', (id) => {
  resource.value = {};
  topicId.value = id;
  openModal();
})

async function createResource() {

  if (!validateYoutubeUrl()) {
    error.value = true;
    return;
  }

  const {title, url} = resource.value;
  const topic = topicId.value;

  const result = await resourceApi.create({
    topic, title, url,
  });

  if (result) {
    closeModal();
    EventBus.emit('load-resource', result);
    EventBus.emit('sidebar.topic.refresh', topicId.value);
  }
}

function validateYoutubeUrl() {
  const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return youtubeUrlRegex.test(resource.value.url);
}

</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 3px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.modal-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #374151;
}

.close-icon {
  cursor: pointer;
  color: #94A3B8;
}

.close-icon:hover {
  color: #6B7280;
}

.error {
  color: #F43F5E;
  font-size: 0.9rem;

}


</style>