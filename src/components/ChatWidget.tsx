"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatWidget.css';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Fade,
  Badge,
  Avatar,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  ExpandLess as ExpandIcon,
  ExpandMore as CollapseIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSocket } from '@/src/contexts/SocketContext';
import moment from 'moment';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  userId?: string;
}

interface ChatWidgetProps {
  orderCode: string;
}

export default function ChatWidget({ orderCode }: ChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();
  const hasJoinedRef = useRef(false);

//   console.log('🎨 ChatWidget render:', { orderCode, socket: !!socket, isConnected, messagesCount: messages.length });

  // Generate random username on first load
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      const randomUsername = `User${Math.floor(Math.random() * 1000)}`;
      setUsername(randomUsername);
      localStorage.setItem('chat-username', randomUsername);
    }
  }, []);

    // Simple socket setup
  useEffect(() => {
    if (!socket || !orderCode) {
      console.log('❌ Socket not available yet:', { socket: !!socket, orderCode });
      return;
    }

    console.log('🔗 Setting up socket for chat:', socket.id || 'connecting...', 'connected:', socket.connected);

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      console.log('📨 Received new chat message:', message);
      setMessages(prev => [...prev, message]);
      if (!isExpanded) {
        setHasNewMessages(true);
      }
    };

    // Listen for chat history  
    const handleChatHistory = (history: ChatMessage[]) => {
      console.log('📜 Received chat history:', history?.length || 0, 'messages');
      setMessages(history || []);
    };

    // Add listeners
    socket.on('chat-message', handleNewMessage);
    socket.on('chat-history', handleChatHistory);

    // Join chat immediately if connected, or wait
    if (socket.connected || socket.id) {
      console.log('✅ Socket ready, joining chat immediately');
      socket.emit('join-chat', orderCode);
      socket.emit('get-chat-history', orderCode);
    } else {
      console.log('⏳ Socket not ready, waiting...');
      // Try joining after a delay
      const timeout = setTimeout(() => {
        console.log('⏰ Timeout reached, attempting to join...');
        socket.emit('join-chat', orderCode);  
        socket.emit('get-chat-history', orderCode);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        socket.off('chat-message', handleNewMessage);
        socket.off('chat-history', handleChatHistory);
        socket.emit('leave-chat', orderCode);
      };
    }

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('chat-message', handleNewMessage);
      socket.off('chat-history', handleChatHistory);
      socket.emit('leave-chat', orderCode);
    };
  }, [socket, orderCode]);

  // Join chat room when ready
  useEffect(() => {
    if (!socket || !isConnected || !orderCode || hasJoinedRef.current) return;

    console.log('� Joining chat room for order:', orderCode);
    hasJoinedRef.current = true;

    // Join chat room for this order
    socket.emit('join-chat', orderCode);

    // Request chat history when joining
    socket.emit('get-chat-history', orderCode);

    return () => {
      console.log('🧹 Leaving chat room for:', orderCode);
      if (hasJoinedRef.current) {
        socket.emit('leave-chat', orderCode);
        hasJoinedRef.current = false;
      }
    };
  }, [socket, isConnected, orderCode]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setHasNewMessages(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) {
      console.log('❌ Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasSocket: !!socket,
        socketConnected: socket?.connected
      });
      return;
    }

    console.log('📤 Sending chat message:', {
      orderCode,
      message: newMessage.trim(),
      username,
      socketId: socket.id,
      socketConnected: socket.connected
    });

    socket.emit('send-chat-message', {
      orderCode,
      message: newMessage.trim(),
      username: username,
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUsernameEdit = () => {
    setTempUsername(username);
    setIsEditingUsername(true);
  };

  const handleUsernameSave = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      localStorage.setItem('chat-username', tempUsername.trim());
    }
    setIsEditingUsername(false);
  };

  const handleUsernameCancel = () => {
    setTempUsername('');
    setIsEditingUsername(false);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#FF5722', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <>
      {/* Chat Toggle Button - Always visible */}
      <Box
        sx={{
          position: 'fixed',
          right: isExpanded ? { xs: 280, sm: 350 } : 20,
          bottom: 20,
          zIndex: 1200,
          transition: 'right 0.3s ease-in-out',
        }}
      >
        <IconButton
          onClick={handleToggleExpand}
          className={hasNewMessages && !isExpanded ? 'chat-floating-button' : ''}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Badge badgeContent={hasNewMessages ? '!' : 0} color="error">
            {isExpanded ? <CloseIcon /> : <ChatIcon />}
          </Badge>
        </IconButton>
      </Box>

      {/* Chat Panel */}
      <Fade in={isExpanded}>
        <Paper
          elevation={8}
          className="chat-widget chat-widget-panel"
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: { xs: 260, sm: 320 },
            height: { xs: 400, sm: 480 },
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              Chat - {orderCode} ({messages.length})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isConnected ? '#4CAF50' : '#f44336',
                }}
              />
              <IconButton
                size="small"
                onClick={handleToggleExpand}
                sx={{ color: 'white' }}
              >
                <CollapseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            className="chat-messages"
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 1,
              backgroundColor: '#f5f5f5',
            }}
          >
            <List sx={{ p: 0 }}>
              {messages.length === 0 && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                    Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện! 💬
                  </Typography>
                </ListItem>
              )}
              {messages.map((msg, index) => {
                const isOwnMessage = msg.username === username;
                return (
                  <ListItem
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      py: 0.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem',
                        backgroundColor: getAvatarColor(msg.username),
                        mx: 1,
                      }}
                    >
                      {msg.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box
                      className="chat-bubble"
                      sx={{
                        maxWidth: '70%',
                        backgroundColor: isOwnMessage ? 'primary.main' : 'white',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderRadius: 2,
                        p: 1,
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {msg.username}
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {msg.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.7rem',
                          opacity: 0.7,
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        {moment(msg.timestamp).format('HH:mm')}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Username Section */}
          <Box sx={{ px: 1.5, py: 1, backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
            {isEditingUsername ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUsernameSave()}
                  placeholder="Enter your name"
                  sx={{ flex: 1, fontSize: '0.75rem' }}
                />
                <IconButton size="small" onClick={handleUsernameSave} color="primary">
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleUsernameCancel}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Bạn: {username}
                </Typography>
                <IconButton size="small" onClick={handleUsernameEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Debug Info (temporary) */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ px: 1.5, py: 0.5, backgroundColor: '#fff3cd', fontSize: '0.7rem' }}>
              <Typography variant="caption">
                🐛 Socket: {socket?.id || 'none'} | Messages: {messages.length} | Connected: {socket?.connected ? '✅' : '❌'}
              </Typography>
              
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!socket}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !socket}
                      size="small"
                      color="primary"
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            {!socket?.connected && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                {socket ? 'Đang kết nối...' : 'Khởi tạo socket...'}
              </Typography>
            )}
          </Box>
        </Paper>
      </Fade>
    </>
  );
}