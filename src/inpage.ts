type EventName =
  | 'connect'
  | 'disconnect'
  | 'chainChanged'
  | 'accountsChanged'
  | 'message'

export type RequestArguments = {
  method: string
  params?: unknown[] | Record<string, unknown>
}

export type PostMessageStream = {
  target: string
  data: RequestArguments
}

window.easy = {
  request: (args: RequestArguments) => {
    window.postMessage(
      {
        target: 'easywallet_contentscript',
        data: args
      },
      window.location.origin
    )

    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent<PostMessageStream>) => {
        if (event.data.target === 'easywallet_inpage') {
          window.removeEventListener('message', listener)

          console.log(event)

          resolve(event.data.data)
        }
      }
      window.addEventListener('message', listener)
    })
  }
}
