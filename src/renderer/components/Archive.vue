<template>
  <div class="table-container">
    <h1 class="title">Archived Resources</h1>
    <div class="archived-list">
      <table v-show="resources.length > 0">
        <thead>
        <tr>
          <th>Title</th>
          <th>Created at</th>
          <th>Archived at</th>
          <th class="action-header">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.title }}</td>
          <td>{{ resource.created_at }}</td>
          <td>{{ resource.archived_at }}</td>
          <td class="actions">
            <EyeIcon class="icon" @click="view(resource.id)"/>
            <ArchiveRestoreIcon class="icon" @click="restore(resource.id)"/>
            <span>
              <button
                  v-if="resource.delete"
                  @click="del(resource.id)"
                  class="delete-button">
                Comfirm
              </button>
              <TrashIcon
                  class="icon"
                  v-if="!resource.delete"
                  @click="resource.delete = true"/>
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {resourceApi} from '@renderer/Api'
import {ArchiveRestoreIcon, EyeIcon, TrashIcon} from 'lucide-vue-next';
import EventBus from "../EventBus";

const resources = ref([]);

onMounted(() => {
  loadArchived()
})

async function loadArchived() {
  resources.value = await resourceApi.getArchived();
}

function view(id) {
  EventBus.emit('load-resource', id)
}

function restore(id) {
  resourceApi.restore(id).then(() => {
    loadArchived();
    EventBus.emit('reload-sidebar')
  })
}

function del(id) {
  resourceApi.delete(id).then(() => {
    loadArchived();
  })
}
</script>

<style scoped>

.title {
  margin-top: 1rem;
  font-size: 2rem;
  color: #334155;
}

.table-container {
  padding: 1rem;
  background: #FAFAFA;
}

.archived-list {
  overflow-y: auto;
  height: 90vh;
}

.action-header {
  text-align: center;
  width: 150px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.icon {
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}

.delete-button {
  background-color: #f87171;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #ef4444;
}

</style>