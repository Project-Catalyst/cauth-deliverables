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
      <q-card-section class="row">
        <p class="tex"></p>
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
import { CAuthMode } from '../CAuthMode';
import { useQuasar, format, Cookies } from 'quasar';

const router = useRouter();
// Defining props and emits
const props = defineProps({
  modelValue: Boolean,
  title: {
    default: 'Connect Wallet',
    type: String,
  },
});
const emit = defineEmits(['update:modelValue']);
const $q = useQuasar();
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
      console.log(wallet);
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
  console.log(`${process.env.BACKEND_URL}`);

  const authCode = crypto.randomBytes(64).toString('hex');

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
      //Hide this popup
      value.value = false;
      console.log('Local signature verification is positive');

      //If we are in dapp mode we do everything on the client side and connect directly to the wallet or a blockchain API
      if (cAuthStore.mode === CAuthMode.dapp) {
        const cookieData = {
          wallet: cAuthStore.wallet.name,
          data: dataToSign,
        };
        Cookies.set('cAuth', JSON.stringify(cookieData), {
          expires: '7d',
          sameSite: 'Strict',
        });
        //Set authentication to true in the application state
        cAuthStore.authenticate(dataToSign, signature);
        $q.notify({
          message: 'You have successfully signed in!',
          color: 'positive',
        });
      }
      /**
       * In both webapp and bridge mode we do the same thing at the frontend, send data for further verification.
       * The backend will decide (depending on configuration)
       */
      if ([CAuthMode.webapp, CAuthMode.bridge].indexOf(cAuthStore.mode) > -1) {
        try {
          const walletAddresses =
            await cAuthStore.browserWallet.getUsedAddresses();

          const response = await axios.post(
            `${process.env.BACKEND_URL}/authorize`,
            {
              client_id: cAuthStore.urlParams.get('client_id'),
              redirect_uri: cAuthStore.urlParams.get('redirect_uri'),
              scope: cAuthStore.urlParams.get('scope'),
              state: cAuthStore.urlParams.get('state'),
              response_type: cAuthStore.urlParams.get('response_type'),
              nft: nft,
              authCode: authCode,
              signature: signature,
              rewardAddress: address,
              walletAddresses: JSON.stringify(walletAddresses),
            },
            { withCredentials: true }
          );
          console.log(`Redirecting to ${response.data.redirect}`);
          document.location.href = response.data.redirect;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.toJSON());
            $q.notify({
              message: error.message,
              color: 'negative',
            });
          } else {
            console.error('Unexpected error:', error);
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}
</script>

<style scoped></style>
