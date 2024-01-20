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
    // 发送消息给 content script
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
          resolve(event.data.data)
        }
      }
      // 监听 content script 的消息
      window.addEventListener('message', listener)
    })
  }
}
