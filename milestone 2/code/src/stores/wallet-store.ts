import { defineStore } from 'pinia';
import { BrowserWallet,Wallet } from '@meshsdk/core';

export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    walletConnected : false,
    wallet : <Wallet>{},
    browserWallet : <BrowserWallet>{},
  }),
  getters: {
  },
  actions: {
    connectWallet(wallet:Wallet,browserWallet:BrowserWallet){
      this.wallet = wallet
      this.browserWallet = browserWallet
      this.walletConnected = true
    },
    disconnectWallet(){
      this.wallet = <Wallet>{}
      this.browserWallet = <BrowserWallet>{}
      this.walletConnected = false
    }
  },
});
