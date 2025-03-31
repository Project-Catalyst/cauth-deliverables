//This store should be extracted to a plugin
import { defineStore } from 'pinia';
import {
  BrowserWallet,
  Wallet,
  Asset,
  AssetExtended,
  AssetMetadata,
  DataSignature,
  BlockfrostProvider,
} from '@meshsdk/core';
import { CAuthMode, getCAuthMode } from 'src/CAuthMode';

const blockfrostProvider = new BlockfrostProvider(
  'preprodogagfluB6ehST1uFm3zk0fB6BAhZaQL9'
);

function isCAuthNFT(metadata: AssetMetadata) {
  return (
    metadata.hasOwnProperty('cAuthVersion') && metadata.cAuthVersion === 'v1'
  );
}

export const useCAuthStore = defineStore('cAuth', {
  state: () => ({
    mode: getCAuthMode(process.env.CAUTH_MODE),
    authenticated: false,
    walletConnected: false,
    wallet: <Wallet>{},
    browserWallet: <BrowserWallet>{},
    selectedAsset: <Asset>{},
    assets: <any>[],
    nfts: <any>[],
    signedData: <any>{},
    urlParams: <URLSearchParams>{},
  }),
  getters: {
    isAuthenticated: (state) => {
      // TODO: Do a more elaborate check
      return state.authenticated;
    },
  },
  actions: {
    connectWallet(wallet: Wallet, browserWallet: BrowserWallet) {
      this.wallet = wallet;
      this.browserWallet = browserWallet;
      this.walletConnected = true;
    },
    disconnectWallet() {
      this.wallet = <Wallet>{};
      this.browserWallet = <BrowserWallet>{};
      this.walletConnected = false;
      this.selectedAsset = <Asset>{};
      this.assets = [];
      this.nfts = [];
      this.signedData = {};
      this.authenticated = false;
    },
    logout() {
      this.authenticated = false;
      this.signedData = {};
    },
    setAssets(assets: AssetExtended[]) {
      this.assets = assets;
    },
    setNFTs(data: AssetMetadata[]) {
      this.nfts = data;
    },

    selectNFT(nft: AssetMetadata) {
      console.log(nft);
    },
    authenticate(data: any, signature: DataSignature) {
      this.authenticated = true;
      this.signedData = data;
    },
    async reauthenticate(cookie: any) {
      if (cookie instanceof Promise) {
        cookie = await cookie;
        cookie = cookie.cauthLogin;
      }
      console.log(cookie);

      const wallets = await BrowserWallet.getInstalledWallets();
      const wallet = wallets.filter(
        (wallet) => wallet.name == cookie.wallet
      )[0];
      //Check if the wallet is still there
      // console.log(wallet);
      const enabledWallet = await BrowserWallet.enable(wallet.name);
      this.connectWallet(wallet, enabledWallet);
      this.assets = await enabledWallet.getAssets();
      const nfts: AssetMetadata[] = await Promise.all(
        this.assets.map(async (asset: any) => {
          return {
            asset: asset,
            metadata: await blockfrostProvider.fetchAssetMetadata(asset.unit),
          };
        })
      );
      this.nfts = nfts.filter((nft) => isCAuthNFT(nft.metadata));
      // console.log(cookie.data);

      const hasRightNFT =
        this.nfts.filter((nft: any) => {
          // console.log(nft.asset.assetName, cookie.data.username);
          // console.log(nft.metadata.email, cookie.data.metadata.email);
          return (
            nft.asset.assetName == cookie.data.username &&
            nft.metadata.email == cookie.data.metadata.email
          );
        }).length > 0;
      // console.log(hasRightNFT);
      if (hasRightNFT) {
        this.signedData = cookie.data;
        this.authenticated = true;
        if (this.mode === CAuthMode.webapp) {
          window.location.hash = '#/secure';
        }
        if (this.mode === CAuthMode.bridge) {
          console.log('do  redirect');
        }
      }
    },
  },
});
