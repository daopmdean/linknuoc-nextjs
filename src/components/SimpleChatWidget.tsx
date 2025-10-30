"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Button,
  Stack
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSocket } from '@/src/contexts/SocketContext';

interface SimpleChatWidgetProps {
  orderCode: string;
}

export default function SimpleChatWidget({ orderCode }: SimpleChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket, isConnected } = useSocket();

  console.log('🎨 SimpleChatWidget render:', { 
    orderCode, 
    socket: !!socket, 
    socketId: socket?.id,
    isConnected, 
    messagesCount: messages.length,
    socketConnected: socket?.connected
  });

  useEffect(() => {
    console.log('🔍 Socket status check:', { 
      hasSocket: !!socket, 
      isConnected, 
      socketConnected: socket?.connected,
      socketId: socket?.id 
    });

    if (!socket) {
      console.log('❌ No socket instance');
      return;
    }

    if (!isConnected && !socket.connected) {
      console.log('❌ Socket not connected yet');
      return;
    }

    console.log('✅ Socket ready, setting up listeners');

    const handleMessage = (msg: any) => {
      console.log('📨 Got message:', msg);
      setMessages(prev => [...prev, msg]);
    };

    const handleHistory = (history: any[]) => {
      console.log('📜 Got history:', history);
      setMessages(history || []);
    };

    socket.on('chat-message', handleMessage);
    socket.on('chat-history', handleHistory);

    // Auto join when socket is ready
    console.log('🔗 Joining chat room');
    socket.emit('join-chat', orderCode);
    socket.emit('get-chat-history', orderCode);

    return () => {
      console.log('🧹 Cleanup');
      socket.off('chat-message', handleMessage);
      socket.off('chat-history', handleHistory);
      socket.emit('leave-chat', orderCode);
    };
  }, [socket, isConnected, socket?.connected, orderCode]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) {
      console.log('❌ Cannot send message');
      return;
    }

    console.log('📤 Sending message:', newMessage);
    socket.emit('send-chat-message', {
      orderCode,
      message: newMessage,
      username: 'TestUser'
    });
    setNewMessage('');
  };

  if (!isExpanded) {
    return (
      <IconButton
        onClick={() => setIsExpanded(true)}
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          backgroundColor: 'primary.main',
          color: 'white',
          width: 56,
          height: 56,
          '&:hover': { backgroundColor: 'primary.dark' },
          zIndex: 1200,
        }}
      >
        <ChatIcon />
      </IconButton>
    );
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 300,
        height: 400,
        zIndex: 1100,
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Chat Debug</Typography>
        <IconButton onClick={() => setIsExpanded(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ mb: 1, fontSize: '0.8rem' }}>
        Socket: {socket?.id || 'none'}<br/>
        Connected: {isConnected ? '✅' : '❌'}<br/>
        Socket.connected: {socket?.connected ? '✅' : '❌'}<br/>
        Messages: {messages.length}
      </Typography>

      <Box sx={{ height: 200, overflow: 'auto', border: '1px solid #ccc', p: 1, mb: 2 }}>
        {messages.length === 0 ? (
          <Typography>No messages yet</Typography>
        ) : (
          messages.map((msg, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography variant="caption">{msg.username}:</Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          ))
        )}
      </Box>

      <Stack spacing={1}>
        <TextField
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type message..."
        />
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button size="small" onClick={sendMessage} disabled={!socket || (!isConnected && !socket?.connected)}>
            Send
          </Button>
          <Button size="small" onClick={() => socket?.emit('get-chat-history', orderCode)}>
            Refresh
          </Button>
          <Button size="small" onClick={() => {
            if (socket) {
              console.log('🔧 Force join chat');
              socket.emit('join-chat', orderCode);
              socket.emit('get-chat-history', orderCode);
            }
          }}>
            Force Join
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}