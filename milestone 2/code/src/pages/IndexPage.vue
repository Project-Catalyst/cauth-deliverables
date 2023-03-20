<template>
  <q-page padding>
    <!-- <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component> -->
      <h4 class="text-weight-bold text-center">Welcome to cAuth</h4>
      <p class="text-caption text-justify q-px-md">
        With cAuth you can create a personal login token that you can use to login to any website that supports cAuth. (tm github copilot)
      </p>

      <div class="flex flex-center">
        <q-btn-group class="q-mx-md">
          <q-btn color="blue-4" :disable="!walletConnected" label="Mint personal login token" to="/personalLoginCreation" />
          <q-btn color="blue-8" :disable="!walletConnected" label="Mint site login token" to="/siteLoginCreation" />
          <!-- <q-btn color="blue-14" label="Manage site login" to="/siteLogin" /> -->
        </q-btn-group>
      </div>
      <div class="flex flex-center">

      </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from 'stores/wallet-store';

const { walletConnected } = storeToRefs(useWalletStore())

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup () {

    return { walletConnected }
  }
});
</script>
