import { EventEmitter } from 'events'
export type RequestArguments = {
  method: string
  params?: unknown[] | Record<string, unknown>
}

export class Provider extends EventEmitter {
  request(args: RequestArguments) {
    const { method, params } = args

    // 请求连接
    if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
    } else {
    }
    return new Promise((resolve, reject) => {
      // this._rpcRequest(payload)
    })
  }
}
