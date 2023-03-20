<template>
  <q-page padding>
    <h4 class="text-weight-bold text-center">Creating Site Credentials</h4>
    <q-breadcrumbs align="left">
      <q-breadcrumbs-el label="Home" to="/" />
      <q-breadcrumbs-el label="Site Login" />
    </q-breadcrumbs>
    <q-form @submit="mintSiteToken()">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step title="Domain for which this NFT is valid" :name="1" icon="help" :done="step > 1">
        <q-input
            outlined
            v-model="domain"
            label="domain"
            type="url"
            lazy-rules
            :rules="[(val) => validateDomain(val) || 'Please enter a valid domain']"
          />
        <q-stepper-navigation>
          <q-btn @click="step = 2" :disable="!validateDomain(domain)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Validity Duration" :name="2" icon="help" :done="step > 2">
        <q-stepper-navigation>
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1" label="day" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="7" label="week" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="31" label="month" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="365" label="year" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="0" label="always" />
          <q-space/>
          <q-btn @click="step = 3" :disable="validity<0" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Valid From" :name="3" icon="help" :done="step > 3">
        <q-input filled v-model="validFrom" :rules="[(val) => validateFrom(val) || 'Please enter a valid date that is not in the past']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="validFrom" mask="DD/MM/YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-stepper-navigation>
          <q-btn @click="step = 4" :disable="!validateFrom(validFrom)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Recipient" :name="4" icon="help" :done="step > 4">
        <q-input v-model="recipientAddress" />
        <q-stepper-navigation>
          <q-btn @click="step = 5" :disable="!validateRecipient(recipientAddress)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-space/>
      <div class="q-px-md">
        <!-- <q-toggle v-model="accept" label="I accept the license and terms" :rules="[(val) => val || 'Please accpet license and terms']"/> -->
        <q-space/>
        <q-space/>
        <q-btn label="Mint Site Token(s)" type="submit"/>
      </div>
    </q-stepper>
    </q-form>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useWalletStore } from 'stores/wallet-store';
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';

const walletStore = useWalletStore();

export default defineComponent({
  name: 'SiteLogin',
  components: {},
  methods: {
    async mintSiteToken() {
      // prepare forgingScript
      const wallet = walletStore.browserWallet
      const usedAddress = await wallet.getUsedAddresses();
      const address = usedAddress[0];
      const forgingScript = ForgeScript.withOneSignature(address);

      const tx = new Transaction({ initiator: wallet });

      // define asset#1 metadata
      const assetMetadata1: AssetMetadata = {
        name: 'cAuth Token',
        // image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
        //mediaType: 'image/jpg',
        description: 'This NFT is minted by cAuth for authentication purposes',
        domain: this.domain,
        daysValid: this.validity,
        validFrom: this.validFrom
      };
      const asset1: Mint = {
        assetName: 'cAuthToken',
        assetQuantity: '1',
        metadata: assetMetadata1,
        label: '721',
        recipient: this.recipientAddress,
      };
      tx.mintAsset(forgingScript, asset1);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log(txHash)
    },
    validateDomain(domain:string){
      return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain)
    },
    validateFrom(date:string){
      const ar = date.split('/')
      const now = new Date()
      if (ar.length < 3) return false
      if(now.getFullYear()>Number.parseInt(ar[2])) return false
      if(now.getMonth()+1>Number.parseInt(ar[1]) && now.getFullYear() === Number.parseInt(ar[2])) return false
      if(Number.parseInt(now.toLocaleDateString().split('/')[0]) > Number.parseInt(ar[0]) && now.getMonth()+1 === Number.parseInt(ar[1]) && now.getFullYear() === Number.parseInt(ar[2])) return false

      return true
    },
    validateRecipient(addr:string){
      if(addr.length === 0) return false
      return true
    }
  },
  setup() {
    return {
      step: ref(1),
      domain: ref(''),
      validity: ref(-1),
      accept:ref(false),
      validFrom:ref(new Date().toLocaleDateString()),
      recipientAddress:ref(''),
      walletStore,
    };
  },
});
</script>
