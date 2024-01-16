const script = document.createElement('script')
// script.textContent = ``
script.src = chrome.runtime.getURL('js/inject.js')
script.setAttribute('async', 'false')
const head = document.head || document.documentElement

head.insertBefore(script, head.children[0])
head.removeChild(script)

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    // console.log('Receive color = ' + msg.color)
    document.body.style.backgroundColor = msg.color
    sendResponse('Change color to ' + msg.color)
  } else {
    sendResponse('Color message is none.')
  }
})
