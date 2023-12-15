<template>
  <q-page class="text-center q-pt-xl">
    <h1>Unauthorized</h1>
    <p class="text-subtitle1">
      You have tried accessing secure content without authorization. Please go
      <router-link exact :to="{ path: '/' }">back</router-link> and authenticate
    </p>
  </q-page>
</template>

<script setup lang="ts"></script>
