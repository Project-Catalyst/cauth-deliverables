<template>
  <q-page class="column flex-center flex">
    <div class="q-mb-xl">
      <!-- Text -->
      <h1>This is a secure page.</h1>
      <p>
        <strong>Instructions:</strong> You can click on each list item. App
        counts number of clicks. Count and items are presisted in the backend.
      </p>
    </div>
    <div class="row">
      <todo-list
        title="Simple todo persisted in the backend"
        active
      ></todo-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TodoList from 'components/TodoList.vue';
</script>
