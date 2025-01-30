<template>
   <div class="init-container">
    <div class="intro">
      <p>DueNote is a powerful tool designed to enhance
        focus and productivity while studying or conducting research.
        It helps you stay organized and efficient with features specifically
        crafted to support deep concentration and clear thinking.</p>
    </div>

  <div class="create-topic">
    <h3>Start creating a topic</h3>
    <form @submit.prevent="createTopic">
      <input
          type="text"
          v-model="topic"
          placeholder="Name your topic"
          required/>
      <button type="submit">Create</button>
    </form>
  </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { topicApi} from "../Api";
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
  }

  .intro {
    margin: 50px auto;
    max-width: 600px;
  }

  .intro p {
    font-size: 1.5rem;
    color: rgba(73, 82, 95, 0.9);
  }

  .create-topic {
    margin: 50px auto;
    max-width: 600px;
  }

  .create-topic h3 {
    margin-bottom: 0.5rem;
    font-weight: normal;
    font-size: 1.5rem;
    color: rgba(73, 82, 95, 0.84);
  }

  .create-topic form {
    display: flex;
    flex-direction: column;
    background: #FAFAFA;
    padding: 1rem;
  }


</style>
