<template>
   <div class="init-container">
    <div class="intro">
      <p>DueNote is a powerful tool designed to enhance
        focus and productivity while studying or conducting research.
        It helps you stay organized and efficient with features specifically
        crafted to support deep concentration and clear thinking.</p>
    </div>

  <div class="create-topic">
    <h3>Create Topic:</h3>
    <form @submit.prevent="createTopic">
      <input
          type="text"
          v-model="topic"
          placeholder="..."
          maxlength="30"
          required/>
      <button type="submit">Create</button>
    </form>
  </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { topicApi} from "@renderer/Api";
import EventBus from "../EventBus";

const topic = ref('')

async function createTopic() {
  const res = await topicApi.create(topic.value);

  if (res.changes) {
      EventBus.emit('reload-sidebar')
      EventBus.emit('load-topic', res.lastInsertRowid)
  }
}

</script>

<style scoped>
  .init-container {
    background: white;
    padding: 1rem;
    min-height: 96%;
  }

  .intro {
    margin: 50px auto;
    max-width: 600px;
  }

  .intro p {
    font-size: 1.5rem;
    color: #374151;
    font-family: Monospaced, sans-serif;
    font-weight: 400;
    line-height: 1.4;
  }

  .create-topic {
    margin: 50px auto;
    max-width: 600px;
  }

  .create-topic h3 {
    margin-bottom: 0;
    font-weight: normal;
    font-size: 1.5rem;
    color: #334155
  }

  .create-topic form {
    display: flex;
    flex-direction: column;

  }


</style>
