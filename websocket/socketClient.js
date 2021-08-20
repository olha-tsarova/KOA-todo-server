import socketClient from 'socket.io-client'
const io = socketClient('http://localhost:3001')

export default io
