type EventName =
  | 'connect'
  | 'disconnect'
  | 'chainChanged'
  | 'accountsChanged'
  | 'message'

interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

window.easy = {
  request: (args: RequestArguments) => {
    console.log(args.method)
    chrome.runtime.sendMessage(args)
  },
  on: (event: EventName, callback: Function) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.event === event) {
        callback(message)
      }
    })
  }
}
