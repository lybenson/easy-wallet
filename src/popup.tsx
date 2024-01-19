import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'

const secret =
  '0x5b91188c221aee8a277de6150e769b161aadb5983d084e83e4f336ceb8049285'
const account = privateKeyToAccount(secret)

const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>()

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url)
    })
  }, [])

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0]
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: '#555555'
          },
          (msg) => {
            console.log('result message:', msg)
          }
        )
      }
    })
  }

  const onChoice = () => {}

  return (
    <>
      <ul style={{ minWidth: '200px', fontSize: '16px' }}>
        <li>Current URL: {currentURL}</li>
        <li>Account: {account.address}</li>
        <li>
          chain info:
          <ul>
            <li>chainId: {goerli.id}</li>
            <li>chainName: {goerli.name}</li>
            <li>RPC: {goerli.rpcUrls.default.http}</li>
          </ul>
        </li>
      </ul>

      <button onClick={onChoice}>Choice </button>
    </>
  )
}

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
