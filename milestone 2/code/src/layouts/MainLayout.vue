<template>
  <q-layout view="lhr Lpr lfr">
    <q-page-container class="flex flex-center">
      <router-view />
    </q-page-container>
    <!-- This component needs to be last to display above everything on page -->
    <connect-wallet/>
    <!-- //TODO We might need to ad a button for -->
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConnectWallet from 'src/components/ConnectWallet.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { ConnectWallet },
  methods:{
  },
  setup () {
    return { }
  }
});
</script>
