<template>
  <div class="topic-container">
    <div class="viewer-panel">
      <div class="empty-viewer" v-if="!resourceId">
          <NotepadTextIcon size="72" class="icon"/>
          <p>Select a note to view.</p>
      </div>
      <BlockEditor
          class="viewer"
          v-show="resourceId"
          :read-only="true"
          :resource-id="resourceId"/>
    </div>
    <div class="list-panel">
      <div class="header">
        <h1 v-if="!edit" class="topic-title">{{ topic.title }}</h1>
        <span v-if="edit">
      <form @submit.prevent="updateTitle">
        <input
            @keydown.esc="cancelEdit"
            type="text"
            class="resource-title"
            v-model="topic.title"
            ref="input_title"
        />
      </form>
    </span>
        <div class="actions">
          <PencilIcon @click="editTopic" size="20" class="icon"/>
          <TrashIcon @click="archiveTopic" size="20" class="delete-icon icon"/>
        </div>
      </div>
      <div class="archive-message" v-if="archiveAlert">
        <p>
          All notes belonging to this topic will be archived.
        </p>
        <div class="archive-actions">
          <a @click="archive" class="archive-confirm" href="#">Confirm</a>
          <a @click="cancelArchive" href="#">Cancel</a>
        </div>
      </div>
      <div class="notes">
        <ul class="notes-list">
          <li class="note" :class="{'selected': selected === resource.id}"
              v-for="resource in resources" :key="resource.id">
            <span @click="showNote(resource)">{{ resource.title }}</span>
            <a @click="loadResource(resource.id)" href="#">Edit</a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, toRef, watch } from 'vue'
import {resourceApi, topicApi} from "@renderer/Api";
import BlockEditor from "./content/BlockEditor.vue";
import {TrashIcon, PencilIcon, NotepadTextIcon} from "lucide-vue-next";
import EventBus from "../EventBus";

const topic = ref({});
const resources = ref([]);
const resourceId = ref(null);
const selected = ref(null);
const archiveAlert = ref(false);
const edit = ref(false);

const props = defineProps({
  entityId: String
})

const topicId = toRef(props, 'entityId');

onMounted(() => {
  getTopic();
  getResources();
})

watch(topicId, () => {
  getTopic();
  getResources();
  selected.value = null;
  resourceId.value = null;
})

async function getTopic() {
  topic.value = await topicApi.get(props.entityId);
}

async function getResources() {
  resources.value = await resourceApi.getByTopic(props.entityId);
}

async function showNote(resource) {
  resourceId.value = resource.id;
}

function loadResource(id) {
  EventBus.emit('load-resource', id)
}

function archiveTopic() {
  if (archiveAlert.value) {
    archiveAlert.value = false;
    return;
  }
  archiveAlert.value = true;
}

function archive() {
  topicApi.archive(props.entityId).then(() => {

    if (localStorage.getItem('lastTopicId') === props.entityId) {
      localStorage.removeItem('lastTopicId');
    }

    EventBus.emit('reload-sidebar')
    EventBus.emit('app.show.init')
  })
}

function cancelArchive() {
  archiveAlert.value = false;
}

function editTopic() {
  edit.value = true;
}

</script>

<style scoped>

.topic-container {
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
}

.list-panel {
  margin-left: 1rem;
  width: 25%;
  background: #FAFAFA;
  padding: 1rem;
  min-height: 100%;
  overflow-y: auto;
}

.archive-message {
  padding: 4px 8px;
  border-radius: 3px;
  border: 1px solid #DC2626;
}

.archive-message p {
  color: #DC2626;
}

.delete-icon {
  color: #E11D48;
}

.delete-icon:hover {
  background: #FEE2E2;
  border-radius: 4px;
}


.icon {
  cursor: pointer;
}

.archive-message a {
  text-decoration: none;
  color: #334155
}

.archive-actions {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.archive-confirm {
  color: #DC2626 !important;
  font-weight: 600;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  color: #64748B;
  display: flex;
  gap: 0.8rem;
}

.viewer-panel {
  width: 75%;
  min-height: 100%;
  overflow-y: auto;
}

.empty-viewer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  & .icon {
    color: #94A3B8;
  }

  & p {
    color: #64748B;
  }

}

.viewer {
  padding: 1rem;
  background-color: #f8f8ec;
}

.topic-title {
  font-weight: normal;
  font-size: 2rem;
  margin: 0;
  color: #0F172A
}

.notes-list {
  list-style: none;
  padding: 0;
}

.note {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1rem;
  margin: 1rem 0;
  max-width: 90%;

  &.selected {
    font-weight: 600;
    padding: 3px;
  }

}


.note a {
  color: #475569;
  text-decoration: none;
  font-size: 1rem;
}

.note span:hover {
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: #475569;
}

.note a:hover {
  color: #1E293B;
  text-decoration: underline;
}

</style>