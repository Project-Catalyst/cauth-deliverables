<template>
  <q-page padding>
    <h4 class="text-weight-bold text-center">Creating Personal Credentials</h4>
    <q-breadcrumbs align="left">
      <q-breadcrumbs-el label="Home" to="/" />
      <q-breadcrumbs-el label="Personal Login" />
    </q-breadcrumbs>
    <q-form @submit="mintPersonalToken()">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step title="Display Name" :name="1" icon="help" :done="step > 1">
        <q-input
            outlined
            v-model="displayName"
            label="Display Name"
            type="text"
            lazy-rules
            :rules="[(val) => validateDisplayName(val) || 'Please enter a valid email']"
          />
        <q-stepper-navigation>
          <q-btn @click="step = 2" :disable="!validateDisplayName(displayName)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Email for which this token will be valid" :name="2" icon="help" :done="step > 2">
        <q-input
            outlined
            v-model="email"
            label="email"
            type="email"
            lazy-rules
            :rules="[(val) => validateEmail(val) || 'Please enter a valid email']"
          />
        <q-stepper-navigation>
          <q-btn @click="step = 3" :disable="!validateEmail(email)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Validity Duration" :name="3" icon="help" :done="step > 3">
        <q-stepper-navigation>
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1" label="day" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="7" label="week" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="31" label="month" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="365" label="year" />
          <q-radio v-model="validity" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="0" label="always" />
          <q-space/>
          <q-btn @click="step = 4" :disable="validity<0" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Valid From" :name="4" icon="help" :done="step > 4">
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
          <q-btn @click="step = 5" :disable="!validateFrom(validFrom)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step title="Recipient" :name="5" icon="help" :done="step > 5">
        <q-input v-model="recipientAddress" />
        <q-stepper-navigation>
          <q-btn @click="step = 6" :disable="!validateRecipient(recipientAddress)" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-space/>
      <div class="q-px-md">
        <!-- <q-toggle v-model="accept" label="I accept the license and terms" :rules="[(val) => val || 'Please accpet license and terms']"/> -->
        <q-space/>
        <q-space/>
        <q-btn label="Mint Personal Token" type="submit" :disable=" step <6"/>
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
    async mintPersonalToken() {
      // prepare forgingScript
      const wallet = walletStore.browserWallet
      const usedAddress = await wallet.getUsedAddresses();
      const address = usedAddress[0];
      const forgingScript = ForgeScript.withOneSignature(address);

      const tx = new Transaction({ initiator: wallet });

      // define asset#1 metadata
      const assetMetadata1: AssetMetadata = {
        name: this.displayName,
        // image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
        //mediaType: 'image/jpg',
        email: this.email,
        description: 'This NFT is minted by cAuth for authentication purposes',
        daysValid: this.validity,
        validFrom: this.validFrom
      };
      const asset1: Mint = {
        assetName: 'Personal cAuthToken',
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
      this.$q.notify({
          message: 'Your cAuth NFT has been minted',
          color: 'positive',
        });
    },
    validateDomain(domain:string){
      return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain)
    },
    validateEmail(email:string){
      return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
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
    },
    validateDisplayName(name:string){
      if(name.length < 5) return false
      return true
    }
  },
  setup() {
    return {
      step: ref(1),
      displayName: ref(''),
      email: ref(''),
      validity: ref(-1),
      accept:ref(false),
      validFrom:ref(new Date().toLocaleDateString()),
      recipientAddress:ref(''),
      walletStore,
    };
  },
});
</script>
