<template>
  <div>
    <q-btn
      color="primary"
      icon="key"
      label="Sign In with Cardano"
      @click="showModal = true"
      :disable="cAuthStore.walletConnected && cAuthStore.authenticated"
    />
    <Suspense>
      <sign-in-modal v-model="showModal" />
      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>
<script setup>
/**
 * label and color should be properties
 */
import { ref } from 'vue';
import SignInModal from './SignInModal.vue';
import { useCAuthStore } from 'src/stores/cauth';
const cAuthStore = useCAuthStore();
const showModal = ref(false);
</script>

<style scoped></style>
