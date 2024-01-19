// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   if (msg.color) {
//     // console.log('Receive color = ' + msg.color)
//     document.body.style.backgroundColor = msg.color
//     sendResponse('Change color to ' + msg.color)
//   } else {
//     sendResponse('Color message is none.')
//   }
// })

import { PostMessageStream } from './inpage'

function injectScript() {
  try {
    const script = document.createElement('script')
    // script.textContent = ``
    script.src = chrome.runtime.getURL('js/inpage.js')
    script.setAttribute('async', 'false')
    const head = document.head || document.documentElement

    head.insertBefore(script, head.children[0])
    head.removeChild(script)
  } catch (error) {
    console.error('Provider injection failed.', error)
  }
}

injectScript()

window.addEventListener('message', (event: MessageEvent<PostMessageStream>) => {
  if (event.data.target === 'easywallet_contentscript') {
    console.log('content_script receive message: ', event.data)
    // chrome.runtime.sendMessage(event.data, (response) => {
    //   console.log(response)
    // })

    window.postMessage(
      {
        target: 'easywallet_inpage',
        data: 'world'
      },
      window.location.origin
    )
  }
})
