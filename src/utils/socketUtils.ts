import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Get or create socket instance
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io({
      path: '/api/socketio',
      addTrailingSlash: false,
    });
  }
  return socket;
};

// Emit socket events for order items
export const emitOrderItemEvent = (eventType: string, data: any) => {
  if (typeof window !== 'undefined') {
    const socketInstance = getSocket();
    if (socketInstance.connected) {
      socketInstance.emit(eventType, data);
    }
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};