import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Store chat messages globally (in production, use database)
const chatMessages: { [orderCode: string]: any[] } = {}

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
        socket.to(data.orderCode).emit('refresh-items', data)
      })

      // Handle joining chat room
      socket.on('join-chat', (orderCode: string) => {
        console.log(`Client ${socket.id} joining chat room: chat-${orderCode}`)
        socket.join(`chat-${orderCode}`)
        
        // Send chat history to the newly joined user
        const history = chatMessages[orderCode] || []
        console.log(`Sending chat history to ${socket.id}:`, history.length, 'messages')
        socket.emit('chat-history', history)
      })

      // Handle leaving chat room
      socket.on('leave-chat', (orderCode: string) => {
        console.log(`Client ${socket.id} leaving chat room: chat-${orderCode}`)
        socket.leave(`chat-${orderCode}`)
      })

      // Handle sending chat messages
      socket.on('send-chat-message', (data: { orderCode: string, message: string, username: string }) => {
        console.log('📨 New chat message received:', {
          orderCode: data.orderCode,
          username: data.username,
          message: data.message,
          socketId: socket.id
        })
        
        const chatMessage = {
          id: `${Date.now()}-${socket.id}`,
          username: data.username,
          message: data.message,
          timestamp: new Date(),
          userId: socket.id,
        }

        // Store message in memory (in production, use database)
        if (!chatMessages[data.orderCode]) {
          chatMessages[data.orderCode] = []
        }
        chatMessages[data.orderCode].push(chatMessage)
        
        // Keep only last 100 messages per order
        if (chatMessages[data.orderCode].length > 100) {
          chatMessages[data.orderCode] = chatMessages[data.orderCode].slice(-100)
        }

        console.log(`📤 Broadcasting message to chat-${data.orderCode}:`, chatMessage)
        console.log(`📊 Total messages in ${data.orderCode}:`, chatMessages[data.orderCode].length)

        // Broadcast to all users in the chat room (including sender)
        io.to(`chat-${data.orderCode}`).emit('chat-message', chatMessage)
        
        // Also emit to the sender to ensure they see their own message
        socket.emit('chat-message', chatMessage)
      })

      // Handle get chat history request
      socket.on('get-chat-history', (orderCode: string) => {
        console.log(`📜 Client ${socket.id} requesting chat history for: ${orderCode}`)
        const history = chatMessages[orderCode] || []
        console.log(`📜 Sending ${history.length} messages to ${socket.id}`)
        socket.emit('chat-history', history)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  res.end()
}

export default SocketHandler