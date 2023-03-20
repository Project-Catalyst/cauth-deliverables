<template>
  <div>
    <q-page-sticky
      position="top-right"
      class="absolute-top-right"
      :offset="[18, 18]"
    >
      <q-btn
        :color="walletStore.walletConnected ? 'purple-10' : 'purple-6'"
        :label="walletStore.walletConnected ? 'Wallet connected' : 'Connect wallet'"
        @click="showDialog()"
      />
    </q-page-sticky>
    <q-dialog v-model="connectDialogOpened">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row">
          <div class="text-h6">Connect Wallet</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section
          class="q-pt-none row"
          v-if="installedWallets.length > 0"
        >
          <div class="col-1">
            <q-checkbox v-model="termsAccepted" />
          </div>
          <div class="col">
            By checking this box and connecting my wallet, I confirm that I have
            read, understood, and agreed to the <u>Terms and Conditions</u>
          </div>
        </q-card-section>
        <q-card-section v-if="installedWallets.length > 0">
          <div
            class="row"
            v-for="(wallet, index) in installedWallets"
            :key="index"
          >
            <q-btn
              flat
              :icon="'img:' + wallet.icon"
              :label="wallet.name"
              @click="connectWallet(wallet)"
              class="full-width"
              :disable="!termsAccepted"
              align="left"
            />
          </div>
        </q-card-section>
        <q-card-section v-if="installedWallets.length == 0">
          You have no wallets installed.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="disconnectDialogOpened">
      <q-card style="max-width: 80vw">
        <q-card-section class="row">
          <div class="text-h6">Connected to
            <q-img :src="walletStore.wallet.icon" style="width: 1.75em;"/>
            {{ format.capitalize(walletStore.wallet.name) }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Would you like to disconnect?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Disconnect" color="primary" @click="walletStore.disconnectWallet()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useWalletStore } from 'stores/wallet-store';
import { BrowserWallet, Wallet } from '@meshsdk/core';
import { useQuasar,format } from 'quasar';

const walletStore = useWalletStore();
// const connectDialogOpened = ref(false);
const installedWallets = ref<Wallet[]>([]);


export default defineComponent({
  name: 'ConnectWallet',
  methods: {
    async showDialog() {

      if(!walletStore.walletConnected){
        installedWallets.value = [];
        this.connectDialogOpened = true;
        const wallets = await BrowserWallet.getInstalledWallets();
        wallets.map((wallet) => {
          console.log(wallet);
          installedWallets.value.push(wallet);
        });
      }
      if(walletStore.walletConnected){
        this.disconnectDialogOpened = true;
      }
    },
    // Make sure to check which net we are connecting to
    async connectWallet(wallet: Wallet) {
      try {
        const enabledWallet = await BrowserWallet.enable(wallet.name);
        this.connectDialogOpened = false;

        walletStore.connectWallet(wallet,enabledWallet);

        this.$q.notify({
          message: `You are connected to ${format.capitalize(wallet.name)}`,
          color: 'positive',
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        let msg = 'Could not connect to wallet.';
        if (e.message.includes('no account set')) {
          msg = 'Please set up an account in your wallet.';
        }
        if (e.message.includes('An error occurred during enable')) {
          msg = 'Connection canceled by user.';
        }
        this.$q.notify({
          message: msg,
          color: 'negative',
        });
        console.error(e);
        console.log(e.message);
      }
    },
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const $q = useQuasar();
    return {
      walletStore,
      connectDialogOpened : ref(false),
      disconnectDialogOpened : ref(false),
      installedWallets,
      termsAccepted : ref(false),
      format
    };

  },
});
</script>
