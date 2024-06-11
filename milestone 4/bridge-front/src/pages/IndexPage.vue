<template>
  <q-page class="text-center page-margin shadow-8" :style-fn="pageStyles">
    <q-toolbar class="bg-primary">
      <q-toolbar-title class="text-white"
        >CAuth - Authorize with Cardano</q-toolbar-title
      >
    </q-toolbar>
    <div class="q-pa-lg">
      <h3>
        <span class="text-bold">{{ clientAppName }}</span> wants to access your
        account
      </h3>
      <p class="text-subtitle1">Application wants to access following data:</p>
      <q-list class="q-pl-lg" style="max-width: 25vh; margin: 0 auto" dense>
        <q-item>
          <q-item-section>Name</q-item-section>
          <q-item-section
            ><q-icon color="deep-purple" name="done"></q-icon
          ></q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Email</q-item-section>
          <q-item-section
            ><q-icon color="deep-purple" name="done"></q-icon
          ></q-item-section>
        </q-item>
      </q-list>
      <p>
        <sign-in-button
          class="q-mr-xs"
          label="Choose your identity"
        ></sign-in-button>
      </p>
      <p>
        <q-btn
          class="q-ml-xs"
          label="Cancel"
          color="negative"
          @click="cancelLogin"
        ></q-btn>
      </p>
      <p class="text-body1">
        Authorizing will redirect you to: <br />
        {{ redirectUri }}
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SignInButton from 'src/components/SignInButton.vue';
import { computed, onMounted, ref } from 'vue';
import { useCAuthStore } from 'src/stores/cauth';
import { api } from '../boot/axios';
import { Cookies } from 'quasar';
import axios from 'axios';

/*-- END OF IMPORTS --*/

const cAuthStore = useCAuthStore();
let urlParams = new URLSearchParams(window.location.search);
cAuthStore.urlParams = urlParams;
let clientAppName: any = ref(null);

const redirectUri = computed(() => {
  return urlParams.get('redirect_uri');
});

function pageStyles(offset: any) {
  return { minHeight: offset ? `calc(55vh - ${offset}px)` : '55vh' };
}
function cancelLogin() {
  try {
    const url = new URL(cAuthStore.urlParams.get('redirect_uri'));
    console.log(url.origin);
    document.location.href = url.origin;
  } catch (e) {
    console.error(e);
  }
}
onMounted(async () => {
  try {
    let result = await api.get(
      `/api/clientName?client_id=${urlParams.get('client_id')}`
    );
    //TODO Check if result has data and clientname
    clientAppName.value = result.data.clientName;

    // const cAuthCookie = Cookies.get('cAuth');
    // if (cAuthCookie !== null) {
    //   //We can try to use token to login automatically
    //   console.log('Haz cookies');
    //   const authCode = cAuthCookie.authCode;
    //   if (authCode !== null) {
    //     console.log('Haz authCode');
    //     const response = await axios.get(
    //       `${process.env.BACKEND_URL}/cauth/login/check`,
    //       {
    //         params: { authCode },
    //       }
    //     );
    //     if (response.data.valid) {
    //       console.log(response.data);
    //       //TODO Redirect back with a correct token
    //     }
    //   }
    // }
  } catch (error) {
    console.log(`${error}`);
  }
});
</script>
<style scoped lang="sass">

@media (min-width: $breakpoint-xl-min)
  .page-margin
    margin: 10% 35%
    min-width: 45vh

@media (min-width: $breakpoint-lg-min) and (max-width: $breakpoint-lg-max)
  .page-margin
    margin: 10% 35%
    min-width: 45vh

@media (max-width: $breakpoint-md-max) and (min-width: $breakpoint-md-min)
  .page-margin
    margin: 5% 20%
    min-width: 40vh

@media (max-width: $breakpoint-sm-max) and (min-width: $breakpoint-sm-min)
  .page-margin
    margin: 5% 10%
    min-width: 40vh


@media (max-width: $breakpoint-xs-max)
  .page-margin
    margin: 1% 1%
    min-width: 40vh
</style>
