<template>
  <li class="resource" :class="{'selected': active}">
    <span v-if="!edit" class="resource-title" @click="getResource(resource.id)">
      {{ resource.title }}
    </span>

    <span v-if="edit">
      <form @submit.prevent="updateTitle">
        <input
            @keydown.esc="cancelEdit"
            type="text"
            class="resource-title"
            v-model="props.resource.title"
            ref="input_title"
        />
        <CircleXIcon @click="cancelEdit" class="cancel-icon" />
      </form>
    </span>
    <PencilIcon v-if="!edit" class="edit-icon icon" @click="rename"/>
    <Trash2Icon v-if="!edit" class="delete-icon icon" @click="deleteResource"/>
  </li>
</template>

<script setup>
import {onMounted, ref, nextTick} from 'vue'
import EventBus from "@renderer/EventBus";
import { resourceApi } from "@renderer/Api";
import { PencilIcon, Trash2Icon, CircleXIcon } from 'lucide-vue-next'

const props = defineProps({
  resource: Object
})

const emit = defineEmits(['reloadResources'])

const edit = ref(false)
const input_title = ref(null)
    
const isOpen = ref(false)
const menu = ref(null)
const options = ref(null)

const active = ref(false)

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})


EventBus.on('load-resource', (id) => {
    selected(id)
})

function handleClickOutside(e) {
  if (isOpen.value &&
      !menu.value.contains(e.target) &&
      !options.value.contains(e.target)
  ) {
    isOpen.value = false;
  }
}

function getResource(resourceId) {
  EventBus.emit('load-resource', resourceId)
}


function selected(id) {
   active.value = false;
   if (props.resource.id === id) {
       active.value = true;
   }
}

async function deleteResource() {
  await resourceApi.delete(props.resource.id)

  /** Emit to parent reload */
  emit('reloadResources')

  /** If is current resource move to Topic */
  EventBus.emit('resource-deleted', props.resource)
}

function rename() {
  edit.value = true;
  isOpen.value = false;

  nextTick(() => {
    input_title.value.focus();
  });
}

function updateTitle() {
  edit.value = false;
  resourceApi.update(props.resource.id, props.resource.title)
  EventBus.emit('resource-updated', props.resource)
}

function cancelEdit() {
  edit.value = false;
  emit('reloadResources')
}

</script>


<style scoped>
.resource {
  display: flex;

  justify-content: space-between;
  cursor: pointer;
  padding: 3px 6px;
  margin: 3px 0 3px 6px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.resource form {
  display: flex;
  align-items: center;
  gap: 4px;
}

.resource form input {
  width: 80%;
  padding: 2px;
}

.icon {
  display: none;
}

.resource:hover .icon {
  display: block;
}

.edit-icon {
  display: none;
  width: 1.2rem;
  margin-right: 0.5rem;
}

.delete-icon {
  color: #E11D48;
  width: 1.2rem;
}

.cancel-icon {
  color: #1E293B;
  width: 1.3rem;
}

.resource:hover {
  background-color: #dbe8fe;
  padding: 6px;
  margin: 3px 0 3px 3px;
}

 .selected {
   background-color: #dbe8fe;
   border-right: 3px solid #1e55af;
}



.resource-title {
  width: 100%;
  color: #1E293B;
}




</style>