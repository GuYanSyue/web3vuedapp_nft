<!-- eslint-disable vue/no-export-in-script-setup -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import crypto_, { useCryptoStore } from '../store/crypto'

// 引用crypto.vue的const宣告變數
// import crypto_ from '../store/user'

const defineStore = useCryptoStore()
const { mint, connectWallet, withdraw, isOwner } = useCryptoStore()
const { account } = storeToRefs(defineStore)

const amountInput = ref(null as any)
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl m-4">
      Get NFT !
    </h1>
    <div v-if="!account">
      <P class="MsoNormal">～。酸辣麵NFT。～</P>
      <P class="MsoNormal">點擊下方橙色按鈕連結錢包購買NFT</P><br>
      <p>Only for Metamask --Goerli network.</p>
    </div>
    <button v-if="!account" class="bg-amber-600 rounded p-4" @click="connectWallet">
      Connect Wallet
    </button>

    <div v-if="account" class="border shadow w-4/12 p-4 mt-10">
      <p class="tit1">
        <span class="hide">～～．</span>酸辣粉 NFT<span class="hide">．～～</span>
      </p><br>
      <img src="../assets/Noodle.jpg" class="img-mid border shadow p-1">

      <br><span>你想鑄造多少？（最大：3）&emsp;</span><br>
      <input
        v-model.number="amountInput"
        type="number"
        :style="{ width: '100px' }"
        name="NFTBookInfo"
        class="py-4 px-4 shadow border rounded"
        maxlength="2"
      >
      <button class="bg-cyan-500 rounded p-4 mt-10" @click="mint(amountInput)">
        Mint
      </button>
    </div>

    <div v-if="account && crypto_.straccount == crypto_.Onlyowner" class="border shadow w-4/12 p-4 mt-10">
      <button class="bg-cyan-500 rounded p-4 mt-10" @click="withdraw()">
        提領餘額
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
