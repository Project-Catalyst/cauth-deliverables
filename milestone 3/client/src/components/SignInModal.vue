<template>
  <q-dialog v-model="value">
    <!-- Select Wallet -->
    <q-card
      style="width: 700px; max-width: 80vw"
      v-show="!cAuthStore.walletConnected"
    >
      <q-card-section class="row">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <!-- Terms and Conditions section-->
      <q-card-section class="q-pt-none row" v-if="installedWallets.length > 0">
        <div class="col-1">
          <q-checkbox v-model="termsAccepted" />
        </div>
        <div class="col">
          By checking this box and connecting my wallet, I confirm that I have
          read, understood, and agreed to the <u>Terms and Conditions</u>
        </div>
      </q-card-section>
      <q-card-section
        v-if="installedWallets.length > 0"
        class="row justify-evenly items-center content-center"
      >
        <q-btn
          v-for="(wallet, index) in installedWallets"
          :key="index"
          :icon="'img:' + wallet.icon"
          :label="wallet.name"
          @click="connectWallet(wallet)"
          :disable="!termsAccepted"
          size="md"
          class="col-3"
        />
      </q-card-section>
      <q-card-section v-if="installedWallets.length == 0">
        You have no wallets installed.
      </q-card-section>
    </q-card>
    <!-- Select NFT -->
    <q-card style="width: 700px; max-width: 80vw" v-show="showSelectToken">
      <q-card-section class="row">
        <div class="text-h6">Choose cAuth NFT</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-btn
          :label="nft.asset.assetName + '(' + nft.metadata.name + ')'"
          v-for="(nft, index) in cAuthStore.nfts"
          @click="loginWithCAuth(nft)"
          :key="index"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import axios from 'axios';
import crypto from 'crypto';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCAuthStore } from 'src/stores/cauth';
import {
  BrowserWallet,
  Wallet,
  AssetMetadata,
  BlockfrostProvider,
  AssetExtended,
  checkSignature,
} from '@meshsdk/core';
import { useQuasar, format, Cookies } from 'quasar';
const router = useRouter();
// Defining props and emits
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
const $q = useQuasar();
let title = 'Connect Wallet';
//Initializing content
const cAuthStore = useCAuthStore();
const installedWallets = ref<Wallet[]>([]);
populateWallets();

// Computed Values
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const termsAccepted = computed({
  get() {
    return cAuthStore.termsAccepted;
  },
  set(value) {
    cAuthStore.termsAccepted = value;
  },
});

const showSelectToken = computed({
  get() {
    return (
      cAuthStore.walletConnected &&
      Object.keys(cAuthStore.selectedAsset).length == 0
    );
  },
  set(value) {
    console.log(value);
  },
});

// Helper functions
async function populateWallets() {
  if (!cAuthStore.walletConnected) {
    installedWallets.value = [];
    const wallets = await BrowserWallet.getInstalledWallets();

    wallets.map((wallet) => {
      // console.log(wallet);
      installedWallets.value.push(wallet);
    });
  }
}

async function connectWallet(wallet: Wallet) {
  try {
    console.log('running connectWallet');
    const enabledWallet = await BrowserWallet.enable(wallet.name);
    cAuthStore.connectWallet(wallet, enabledWallet);
    const assets = await getAssets(enabledWallet);
    const nfts = await getNfts(assets);
    cAuthStore.setAssets(assets);
    cAuthStore.setNFTs(nfts);

    $q.notify({
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
    $q.notify({
      message: msg,
      color: 'negative',
    });
    console.error(e);
    console.log(e.message);
  }
}
const blockfrostProvider = new BlockfrostProvider(
  'preprodogagfluB6ehST1uFm3zk0fB6BAhZaQL9'
);

function isCAuthNFT(metadata: AssetMetadata) {
  return (
    metadata.hasOwnProperty('cAuthVersion') && metadata.cAuthVersion === 'v1'
  );
}

async function getAssets(wallet: BrowserWallet) {
  return await wallet.getAssets();
}

async function getNfts(assets: AssetExtended[]) {
  let nfts: AssetMetadata[] = [];

  nfts = await Promise.all(
    assets.map(async (asset) => {
      return {
        asset: asset,
        metadata: await blockfrostProvider.fetchAssetMetadata(asset.unit),
      };
    })
  );

  return nfts.filter((nft) => isCAuthNFT(nft.metadata));
}

async function loginWithCAuth(nft: any) {
  console.log('Trying to login using', nft);

  //Generate the
  const authCode = crypto.randomBytes(64).toString('hex');
  // console.log('generatedCode', authCode);
  const dataToSign = {
    username: nft.asset.assetName,
    policyId: nft.asset.policyId,
    metadata: nft.metadata,
    authCode: authCode,
  };

  const addresses = await cAuthStore.browserWallet.getRewardAddresses();
  const address = addresses[0];
  const signature = await cAuthStore.browserWallet
    .signData(address, JSON.stringify(dataToSign))
    .catch((error) => {
      $q.notify({
        message: error.message,
        color: 'negative',
      });
      console.log(error);
    });
  try {
    const correctlySigned = checkSignature(
      JSON.stringify(dataToSign),
      address,
      signature
    );
    if (correctlySigned) {
      $q.notify({
        message: 'You have successfully signed in!',
        color: 'positive',
      });
      value.value = false;
      cAuthStore.authenticate(dataToSign, signature);
      const cookieData = {
        wallet: cAuthStore.wallet.name,
        data: cAuthStore.signedData,
      };
      if (cAuthStore.mode === 'spa') {
        Cookies.set('cAuth', JSON.stringify(cookieData), {
          expires: '7d',
          sameSite: 'Strict',
        });
      }
      if (cAuthStore.mode === 'webapp') {
        try {
          const response = await axios.post(
            'http://localhost:3000/cauthlogins',
            cookieData
          );
          console.log('Response:', response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
          } else {
            console.error('Unexpected error:', error);
          }
        }
        Cookies.set(
          'cAuth',
          JSON.stringify({
            authCode: cookieData.data.authCode,
          }),
          {
            expires: '7d',
            sameSite: 'Strict',
          }
        );
      }

      router.push('/secure');
    }
  } catch (e) {
    console.log(e);
  }
}
</script>

<style scoped></style>
