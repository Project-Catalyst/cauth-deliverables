<template>
  <div>
    <!-- Removed disable as we are not using disconnect and logout buttons
      :disable="cAuthStore.walletConnected && cAuthStore.authenticated" -->
    <q-btn
      color="primary"
      icon="key"
      :label="label"
      @click="showModal = true"
    />
    <Suspense>
      <sign-in-modal v-model="showModal" title="Connect to your Wallet" />
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cAuthStore = useCAuthStore();
const showModal = ref(false);
console.log(`Backend is ${process.env.BACKEND_URL}`);
console.log(`cAuth Mode is ${process.env.CAUTH_MODE}`);

defineProps({
  label: {
    default: 'Sign In with Cardano',
    type: String,
  },
});
</script>

<style scoped></style>
