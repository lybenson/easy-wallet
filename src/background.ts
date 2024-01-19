import axios from 'axios'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'

const secret =
  '0x5b91188c221aee8a277de6150e769b161aadb5983d084e83e4f336ceb8049285'
const account = privateKeyToAccount(secret)
const rpc_url = 'https://rpc.ankr.com/eth_goerli'

const walletClient = createWalletClient({
  account,
  chain: goerli,
  transport: http(rpc_url)
})

const openChoiceAccountWindow = () => {
  chrome.windows.getCurrent((currentWindow) => {
    const width = 400
    const height = 500
    const left = (currentWindow.left || 0) + (currentWindow.width || 0) - width
    const top = currentWindow.top || 0

    chrome.windows.create({
      url: 'choice.html',
      type: 'popup',
      width,
      height,
      top,
      left
    })
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'easywallet_background') {
    console.log(message)
    const { data } = message

    if (data.method === 'eth_requestAccounts') {
      openChoiceAccountWindow()
    } else if (data.method === 'eth_accounts') {
      chrome.storage.local.get(['accounts'], async (result) => {
        sendResponse(result.accounts.map((account: any) => account.address))
      })
    } else {
      chrome.storage.local.get(['goerli'], async (result) => {
        const chainInfo = result.goerli
        const publicClient = createPublicClient({
          chain: goerli,
          transport: http(chainInfo.rpc)
        })

        const walletClient = createWalletClient({
          account,
          chain: goerli,
          transport: http(rpc_url)
        })
        // sendResponse('22312')
        // const response = await publicClient.request(data)

        const response = await walletClient.sendTransaction({
          to: account.address,
          value: parseEther('0.000000001')
        })

        sendResponse(response)
      })
    }
    return true
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    goerli: {
      chainId: goerli.id,
      chainName: goerli.name,
      rpc: rpc_url
    }
  })

  chrome.storage.local.set({
    accounts: [
      {
        address: account.address,
        secret: secret
      }
    ]
  })
})

// window.easy
//   .request({
//     method: 'eth_accounts'
//   })
//   .then((res) => console.log(res))

// window.easy
//   .request({
//     method: 'eth_chainId'
//   })
//   .then((res) => console.log(res))
