import socketIo from 'socket.io'
import SocketChannel from '../lib/SocketChannel'
import {
  appUpdated,
  connection,
  disconnect,
  userConnected,
  userDisconnect,
  userDisconnected
} from '../constants/socketEvents'

const socketRoutes = () => {
  const socketServer = socketIo(3001, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: '*',
      credentials: true
    }
  })

  const channel = new SocketChannel(socketServer)

  socketServer.on(connection, socket => {
    console.log('Connected -------------', socket.id)

    socket.on(userConnected, data => {
      if (data.userId && socket.id) {
        socket.userId = data.userId
        channel.connectUser(socket.userId, socket.id)
      }
    })

    socket.on(userDisconnect, data => {
      if (data.userId && socket.id) {
        channel.notify(data.userId, { type: userDisconnected })
        channel.disconnectUser(data.userId)
      }
    })

    socket.on(disconnect, data => {
      if (socket.userId && socket.id) {
        channel.disconnectSocket(socket.id, socket.userId)
      }
    })

    socket.on(appUpdated, data => {
      channel.notify(data.userId, data)
    })
  })
}

export default socketRoutes
