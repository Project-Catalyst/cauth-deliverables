<template>
  <div>
    <!-- Wallet status-->
    <q-btn
      :color="cAuthStore.walletConnected ? 'positive' : 'grey'"
      :label="cAuthStore.walletConnected ? 'disconnect' : 'disconnected'"
      :disable="!cAuthStore.walletConnected"
      @click="showDisconnectModal = true"
      class="q-ml-sm"
    />
    <q-dialog v-model="showDisconnectModal">
      <q-card style="max-width: 80vw">
        <q-card-section class="row">
          <div class="text-h6">
            Connected to
            <q-img :src="cAuthStore.wallet.icon" style="width: 1.75em" />
            {{ format.capitalize(cAuthStore.wallet.name) }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Would you like to disconnect?</span>
        </q-card-section>
        <q-card-actions class="row justify-evenly items-center content-center">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn
            label="Disconnect"
            color="positive"
            @click="disconnect()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
// import axios from 'axios';
// const checkCAuthLogin = async (authCode: string): Promise<void> => {
//   try {
//     const response = await axios.get(
//       `${process.env.BACKEND_URL}/cauth/login/check`,
//       {
//         params: {
//           authCode,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // Handle Axios-specific error
//       console.error('Error message:', error.message);
//     } else {
//       // Handle non-Axios error
//       console.error('Unexpected error:', error);
//     }
//   }
// };

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCAuthStore } from 'src/stores/cauth';
import { format, useQuasar } from 'quasar';
const cAuthStore = useCAuthStore();
const router = useRouter();
// const $q = useQuasar();
// if ($q.cookies.has('cAuth')) {
//   if (cAuthStore.mode === 'spa') {
//     cAuthStore.reauthenticate($q.cookies.get('cAuth'));
//   }
//   if (cAuthStore.mode === 'webapp') {
//     console.log(`Running in ${cAuthStore.mode} mode`, $q.cookies.get('cAuth'));
//     const cookie: any = $q.cookies.get('cAuth');
//     if (cookie.hasOwnProperty('authCode')) {
//       const data = checkCAuthLogin(cookie.authCode);
//       console.log(data);
//       cAuthStore.reauthenticate(data);
//     } else {
//       console.error('No authCode in cookie');
//     }
//   }
// }

const showDisconnectModal = ref(false);
function disconnect() {
  cAuthStore.disconnectWallet();
  router.push('/');
}
</script>

<style scoped></style>
