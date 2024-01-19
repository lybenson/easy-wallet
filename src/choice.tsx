import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const ChoiceAccount = () => {
  const [accounts, setAccounts] = useState<
    {
      address: string
      secret: string
    }[]
  >([])
  useEffect(() => {
    chrome.storage.local.get(['accounts'], (result) => {
      const accounts = result.accounts

      setAccounts(accounts)
    })
  }, [])
  return (
    <div>
      {accounts.map((account, index) => (
        <div key={index}>
          <input
            type='checkbox'
            name='checked'
          />
          <label>{account.address}</label>
        </div>
      ))}
    </div>
  )
}
const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <ChoiceAccount />
  </React.StrictMode>
)
