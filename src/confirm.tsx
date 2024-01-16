import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const Confirm = () => {
  return <div>Confirm</div>
}
const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <Confirm />
  </React.StrictMode>
)
