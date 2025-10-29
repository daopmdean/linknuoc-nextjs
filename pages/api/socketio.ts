import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: { server: NetServer & { io?: ServerIO } } }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new ServerIO(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('Client connected:', socket.id)

      // Handle joining order room
      socket.on('join-order', (orderCode: string) => {
        console.log(`Client ${socket.id} joining order room: ${orderCode}`)
        socket.join(orderCode)
        socket.emit('joined-order', orderCode)
      })

      // Handle leaving order room  
      socket.on('leave-order', (orderCode: string) => {
        console.log(`Client ${socket.id} leaving order room: ${orderCode}`)
        socket.leave(orderCode)
      })

      // Handle order item events
      socket.on('order-item-created', (data: { orderCode: string, item: any }) => {
        console.log('Broadcasting order-item-created:', data)
        socket.to(data.orderCode).emit('order-item-added', data.item)
      })

      socket.on('order-item-updated', (data: { orderCode: string, item: any }) => {
        console.log('Broadcasting order-item-updated:', data)  
        socket.to(data.orderCode).emit('order-item-updated', data.item)
      })

      socket.on('order-item-deleted', (data: { orderCode: string, itemId: string }) => {
        console.log('Broadcasting order-item-deleted:', data)
        socket.to(data.orderCode).emit('order-item-deleted', data.itemId)
      })

      // Handle generic items changed event
      socket.on('order-items-changed', (data: { orderCode: string, action: string, meta: any, _id: string }) => {
        console.log('Broadcasting order-items-changed:', data)
        socket.to(data.orderCode).emit('refresh-items', data.action)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  res.end()
}

export default SocketHandler