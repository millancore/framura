<template>
  <li class="resource" :class="{'selected': active}">
    <span v-if="!edit" class="resource-title" @click="getResource(resource.id)">
      {{ resource.title }}
    </span>
    <form v-if="edit" @submit.prevent="updateTitle">
        <input
            @keydown.esc="cancelEdit"
            ref="input_title"
            type="text"
            v-model="resource.title">
    </form>
    <ellipsis-horizontal-icon ref="options" @click="toggleMenu" class="icon"/>
    <transition name="fade">
      <div class="context-menu-container">
        <div v-show="isOpen" ref="menu" class="context-menu">
          <ul class="p-2">
            <li @click="rename">
              <pencil-icon class="icon-option edit-icon"/>
              Rename
            </li>
            <li class="delete" @click="deleteResource">
              <trash-icon class="icon-option delete-icon"/>
              Delete
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </li>
</template>

<script setup>
import {onMounted, ref, nextTick} from 'vue'
import {EllipsisHorizontalIcon, PencilIcon, TrashIcon} from '@heroicons/vue/16/solid'
import EventBus from "../EventBus";
import { resourceApi } from "../Api";

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

EventBus.on('resource-loaded', (id) => {
  active.value = false;

  if (props.resource.id === id) {
       active.value = true;
   }
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

function toggleMenu() {
  isOpen.value = !isOpen.value;
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
}

.icon {
  width: 24px;
  display: none;
}

.icon-option {
  width: 16px;
  margin-right: 4px;
}

.edit-icon {
  color: #475569
}

.delete {
  color: #E11D48
}

.context-menu-container {
  position: relative;
}

.context-menu {
  position: absolute;
  padding: 8px;
  background: #FAFAFA;
  border-radius: 4px;
  border: 1px solid #CBD5E1;
  width: 100px;
}

.context-menu ul {
  padding: 3px 6px;
  list-style: none;
}

.context-menu li {
  display: flex;
  justify-content: start;
  padding: 5px;
  border-radius: 4px;
}

.context-menu li:hover {
  background-color: #D1D5DB

}


</style>