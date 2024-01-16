chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.browserAction.setPopup({
    popup: 'choice.html'
  })
})
