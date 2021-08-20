import { changes } from "../constants/socketEvents"

export default class SocketChannel {
  constructor(io) {
    this.io = io
    this.users = {}
  }

  connectUser(userId, socketId) {
    if (!Object.keys(this.users).includes(userId.toString())) {
      this.users[userId] = []
    }

    if (!this.users[userId].includes(socketId)) {
      this.users[userId].push(socketId)
    }
    console.log(this.users)
  }

  disconnectUser(userId) {
    delete this.users[userId]
  }

  disconnectSocket(socketId, userId) {
    if (Object.keys(this.users).includes(userId.toString())) {
      const socketIndex = this.users[userId].indexOf(socketId)
      this.users[userId].splice(socketIndex, 1)

      if (this.users[userId].length === 0) {
        this.disconnectUser(userId)
      }
    }
    console.log(this.users)
  }

  notify(userId, data) {
    this.io.sockets.in(this.users[userId]).emit(changes, data)
  }
}
