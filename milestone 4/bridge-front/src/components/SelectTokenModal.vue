<template>
  <q-dialog v-model="value">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Choose cAuth NFT</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-btn
          label="NFT"
          v-for="(nft, index) in cAuthStore.nfts"
          :key="index"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { useCAuthStore } from 'src/stores/cauth';

const cAuthStore = useCAuthStore();
const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

// const $q = useQuasar();
</script>

<style scoped></style>
