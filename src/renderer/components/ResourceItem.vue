<template>
  <li class="resource">
    <span class="resource-title" @click="getResource(resource.id)">
      {{ resource.title }}
    </span>
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
import {onMounted, ref} from 'vue'
import {EllipsisHorizontalIcon, PencilIcon, TrashIcon} from '@heroicons/vue/16/solid'
import EventBus from "../EventBus";
import { resourceApi } from "../Api";

const props = defineProps({
  resource: Object
})

const isOpen = ref(false)
const menu = ref(null)
const options = ref(null)

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})

function handleClickOutside(e) {
  if (!menu.value.contains(e.target) && !options.value.contains(e.target)) {
    isOpen.value = false;
  }
}

function getResource(resourceId) {
  EventBus.emit('loadResource', resourceId)
}

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

async function deleteResource() {
 const res = resourceApi.delete(props.resource.id)
  EventBus.emit('sidebarReload')
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
  background-color: #F5F5F4;
  border-right: 3px solid #F97316;
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