<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todos.length }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTodoStore } from 'src/stores/todo';
import { storeToRefs } from 'pinia';

const store = useTodoStore();

const { todos, counter, meta } = storeToRefs(store);

interface Props {
  title: string;
  active: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {});
const clickCount = computed(() => counter);
function increment() {
  store.increment();
  return clickCount;
}
</script>
