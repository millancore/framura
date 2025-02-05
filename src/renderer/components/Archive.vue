<template>
  <div class="table-container">
    <h2 class="title">Archived Resources</h2>
    <div class="archived-list">
      <table>
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
          <td>{{ resource.name }}</td>
          <td>...</td>
          <td>...</td>
          <td class="actions">
            <EyeIcon/>
            <ArchiveRestoreIcon/>
            <TrashIcon/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ArchiveRestoreIcon, EyeIcon, TrashIcon} from 'lucide-vue-next';

const resources = ref([
  {id: 1, name: 'Resource 1', archived: true},
  {id: 2, name: 'Resource 2', archived: false},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
  {id: 3, name: 'Resource 3', archived: true},
]);

function viewResource(id) {
  console.log(`Viewing resource with ID: ${id}`);
}

function restoreResource(id) {
  console.log(`Restoring resource with ID: ${id}`);
}

function deleteResource(id) {
  console.log(`Deleting resource with ID: ${id}`)
}
</script>

<style scoped>

.title {
  margin-top: 1rem;
  font-size: 1.5rem;
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

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}

button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>