import {SocketConnection} from '@simpli/serialized-request'
import {Dictionary} from '@simpli/vue-await/lib/Dictionary'
import {ClassType} from 'class-transformer/ClassTransformer'

export interface SocketOptions {
  baseURL?: string
}

export class Socket {
  socketConnection: Dictionary<SocketConnection<any>> = {}
  config: SocketOptions = {}

  constructor(config?: SocketOptions) {
    if (config) {
      this.config = config
    }
  }

  connect<T>(name: string, url: string, classType?: ClassType<T>) {
    if (this.socketConnection[name]) {
      this.socketConnection[name].disconnect()
    }
    const fullUrl = `${this.config.baseURL}${url}`

    if (classType) {
      this.socketConnection[name] = new SocketConnection<T>(fullUrl).as(
        classType
      )
    } else {
      this.socketConnection[name] = new SocketConnection<T>(fullUrl)
    }
    return this.socketConnection[name]
  }

  disconnect(name: string) {
    if (this.socketConnection[name]) {
      this.socketConnection[name].disconnect()
      delete this.socketConnection[name]
    }
  }

  getConnection(name: string) {
    return this.socketConnection[name] ?? null
  }

  disconnectAll() {
    const socketConnection = this.socketConnection
    for (const name in socketConnection) {
      if (socketConnection.hasOwnProperty(name)) {
        this.disconnect(name)
      }
    }
  }
}
