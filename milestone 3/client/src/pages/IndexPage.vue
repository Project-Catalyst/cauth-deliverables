<template>
  <q-page class="text-center q-pt-xl">
    <h1>Welcome to cAuth demo</h1>
    <p class="text-subtitle1">
      The aim of this simple web app is to demonstrate an alternative way of
      authenticating using only Cardano blockchain.
    </p>
    <p class="text-subtitle1">
      This is the welcome page, anyone can see it. This represents the public
      part of the content. Where no authentication is needed.
    </p>
    <sign-in-button></sign-in-button>
  </q-page>
</template>

<script setup lang="ts">
import SignInButton from 'src/components/SignInButton.vue';
</script>
