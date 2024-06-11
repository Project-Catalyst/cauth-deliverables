<template>
  <div>
    <!-- login status -->
    <q-btn
      :color="cAuthStore.authenticated ? 'positive' : 'grey'"
      :label="cAuthStore.authenticated ? 'log out' : 'logged out'"
      :disable="!cAuthStore.authenticated"
      @click="showLogoutModal = true"
      class="q-ml-sm"
    />
    <q-dialog v-model="showLogoutModal">
      <q-card style="max-width: 80vw">
        <q-card-section class="row">
          <div class="text-h6">
            Logged in via
            <q-img :src="cAuthStore.wallet.icon" style="width: 1.75em" />
            {{ format.capitalize(cAuthStore.wallet.name) }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Would you like to logout?</span>
        </q-card-section>
        <q-card-actions class="row justify-evenly items-center content-center">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn
            label="Logout"
            color="positive"
            @click="logout()"
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
//       // TODO This needs to be migrated to
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
const $q = useQuasar();
// if ($q.cookies.has('cAuth')) {
//   if (cAuthStore.mode === 'spa') {
//     cAuthStore.reauthenticate($q.cookies.get('cAuth'));
//   }

//   if (cAuthStore.mode === 'webapp') {
//     console.log('Running in webapp mode', $q.cookies.get('cAuth'));
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

const showLogoutModal = ref(false);

//TODO Do I nee
function logout() {
  cAuthStore.logout();
  $q.cookies.remove('cAuth');
  router.push('/');
}
</script>

<style scoped></style>
