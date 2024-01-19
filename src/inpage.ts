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
  data: any
}

// const _rpcRequest(request, t) {
//   let r = t
//   return (
//     Array.isArray(e) ||
//       (e.jsonrpc || (e.jsonrpc = '2.0'),
//       ('eth_accounts' !== e.method &&
//         'eth_requestAccounts' !== e.method) ||
//         (r = (r, n) => {
//           this._handleAccountsChanged(
//             n.result ?? [],
//             'eth_accounts' === e.method
//           ),
//             t(r, n)
//         })),
//     this._rpcEngine.handle(e, r)
//   )
// }
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
          resolve(event.data.data)
        }
      }
      window.addEventListener('message', listener)
    })
  }
}
