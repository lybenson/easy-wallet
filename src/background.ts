import axios from 'axios'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'

const secret =
  '0x5b91188c221aee8a277de6150e769b161aadb5983d084e83e4f336ceb8049285'
const account = privateKeyToAccount(secret)
const rpc_url = 'https://rpc.ankr.com/eth_goerli'
const rpcIndex = 1
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
    const { data } = message

    if (data.method === 'eth_requestAccounts') {
      // 读取存储中钱包账号数据
      chrome.storage.local.get(['accounts'], async (result) => {
        sendResponse(result.accounts.map((account: any) => account.address))
      })
    } else if (data.method === 'eth_accounts') {
      // 读取存储中记录的已连接网站的账号数据
    } else {
      // 获取链信息发送 rpc 请求
      chrome.storage.local.get(['goerli'], async (result) => {
        const chainInfo = result.goerli
        const response = await fetch(chainInfo.rpc, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: data.method,
            params: data.params || [],
            id: rpcIndex
          })
        }).then((res) => res.json())

        // 结果发送给 content script
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
