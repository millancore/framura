<template>
  <li class="resource" :class="{'selected': active}">
    <span class="resource-title" @click="getResource(resource.id)">
      {{ resource.title }}
    </span>
  </li>
</template>

<script setup>
import {onMounted, ref, nextTick} from 'vue'
import EventBus from "@renderer/EventBus";
import { resourceApi } from "@renderer/Api";

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
  padding: 6px;
  margin: 3px 0 3px 3px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.resource:hover {
  background-color: #dbe8fe;
  border-right: 3px solid #1e55af;
}

 .selected {
   background-color: #dbe8fe;
   border-right: 3px solid #1e55af;
}

.resource:hover .icon {
  display: block;
}

.resource-title {
  width: 100%;
  color: #1E293B;
}




</style>