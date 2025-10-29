"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🔄 SocketProvider: useEffect starting...');
    
    // Initialize socket connection
    const socketInstance = io({
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    socketInstance.on('connect', () => {
      console.log('✅ SocketProvider: Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ SocketProvider: Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('💥 SocketProvider: Socket connection error:', error);
      setIsConnected(false);
    });

    console.log('📝 SocketProvider: Setting socket instance');
    setSocket(socketInstance);

    return () => {
      console.log('🧹 SocketProvider: Cleaning up socket');
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array

  console.log('🎨 SocketProvider render:', { 
    socket: !!socket, 
    isConnected, 
    socketId: socket?.id
  });

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};