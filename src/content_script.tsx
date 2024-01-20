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
  const { data } = event.data
  if (event.data.target === 'easywallet_contentscript') {
    // 发送消息到插件脚本中获取数据
    chrome.runtime.sendMessage(
      {
        target: 'easywallet_background',
        data: data
      },
      (response) => {
        // 接收到来自插件脚本中的消息 并通知给 inpage
        window.postMessage(
          {
            target: 'easywallet_inpage',
            data: response
          },
          window.location.origin
        )
      }
    )
  }
})
