/* eslint-disable no-alert */
/* eslint-disable no-console */
import { ethers } from 'ethers'
import { acceptHMRUpdate, defineStore } from 'pinia'

// import { ref } from 'vue'
import contractABI from '../artifacts/contracts/ShopNFT.sol/ShopNFT.json'
const contractAddress = '0xA6D3d008C0cFDd03378E4De77e692CFAE60120e1'
const Onlyowner = '0xc98E9c69119eb0B764B0d5DCbC1532De8bfC2D4f'
const straccount = ref('0x')

// const Sig: number | ethers.utils.BytesLike | ethers.utils.Hexable = []
const Sig = ref('0x')
// 預設匯出 !重要
export default {
  Sig, Onlyowner, straccount,
}

export const useCryptoStore = defineStore('user', () => {
  const account = ref(null)
  const loading = ref(false)
  const Amount = ref(0)

  async function getBalance() {
    setLoader(true)
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const SimplePayContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

        const count = (await SimplePayContract.getBalance())
        const amt = ethers.utils.formatEther(count)
        console.log('count', amt)
        setLoader(false)
      }
    }
    catch (e) {
      setLoader(false)
      console.log('e', e)
    }
  }

  // ------------------------------------------------------
  async function mint(amountInput: any) {
    console.log('setting loader')
    setLoader(true)
    try {
      console.log('got', amountInput)
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner() // 持有使用者的私鑰並以此簽核 (Signer)
        const ShopPortalContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

        const overrides = {
          value: ethers.utils.parseEther('.000001'),
          gasLimit: 200000,
        }

        // 呼叫合約函數
        const mintTxn = await ShopPortalContract.mint(amountInput, overrides)

        console.log('Mining....', mintTxn.hash)
        await mintTxn.wait()
        console.log('Mined -- ', mintTxn.hash)
      }
      else {
        console.log('Ethereum object doesn\'t exist!')
      }
    }
    catch (error) {
      setLoader(false)
      console.log(error)
    }
  }

  async function withdraw() {
    console.log('setting loader')
    setLoader(true)
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner() // 持有使用者的私鑰並以此簽核 (Signer)
        const ShopPortalContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

        // 呼叫合約函數
        const mintTxn = await ShopPortalContract.withdraw(account)

        console.log('Mining....', mintTxn.hash)
        await mintTxn.wait()
        console.log('Mined -- ', mintTxn.hash)
      }
      else {
        console.log('Ethereum object doesn\'t exist!')
      }
    }
    catch (error) {
      setLoader(false)
      console.log(error)
    }
  }

  // --------------------------------------------------------------

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
        return
      }

      // 授權獲取帳戶
      const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected: ', myAccounts[0])
      account.value = myAccounts[0]

      straccount.value = myAccounts[0]

      await getBalance()
    }
    catch (error) {
      console.log(error)
    }
  }

  // ------------------------------------------------

  function setLoader(value: boolean) {
    console.log('setloader', value)
    loading.value = value
  }

  return {
    setLoader,
    loading,
    connectWallet,
    account,
    Amount,
    Sig,
    Onlyowner,
    straccount,
    mint,
    withdraw,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCryptoStore, import.meta.hot))
