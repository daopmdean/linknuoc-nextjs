"use client";

import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Box,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import OrderItemService from "@/src/services/OrderItemService";
import { useMenuItems } from "@/src/hooks/useMenuItems";
import Layout from "@/src/components/Layout";
import FormDialog from "@/src/components/FormDialog";
import FormEditDialog from "@/src/components/FormEditDialog";
import { useSocket } from "@/src/contexts/SocketContext";

interface Order {
  orderCode: string;
  title: string;
  drinkLink: string;
  deadline?: string;
  menuCode: string;
  redirect: boolean;
  redirectLink: string;
}

interface OrderItem {
  id: string;
  name: string;
  drink: string;
  size: string;
}

interface OrderViewProps {
  order: Order;
}

export default function OrderView({ order: initialOrder }: OrderViewProps) {
  const order = initialOrder;
  const { drinkOptions } = useMenuItems(order.menuCode);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [editItem, setEditItem] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();

  // Main refresh function for API calls - DECLARED FIRST
  const handleRefreshItems = useCallback(async () => {
    console.log('🔄 Refreshing items from API...');
    try {
      const refreshedItems = await OrderItemService.getOrderItems(order.orderCode);
      if (Array.isArray(refreshedItems)) {
        setItems(refreshedItems);
        console.log('✅ Items refreshed:', refreshedItems.length);
      }
    } catch (error) {
      console.error('❌ Failed to refresh items:', error);
    }
  }, [order.orderCode]);

  // Socket refresh function that emits events AND refreshes local data
  const handleRefreshItemsWithSocket = useCallback(async (itemId?: string, updatedData?: any) => {
    console.log('💫 handleRefreshItemsWithSocket called, socket state:', {
      hasSocket: !!socket,
      isConnected,
      socketId: socket?.id,
      itemId,
      updatedData
    });
    
    await handleRefreshItems();
    if (socket && isConnected) {
      const eventData = {
        orderCode: order.orderCode,
        meta: updatedData,
        _id: itemId,
        action: 'refresh'
      };
      
      console.log('📡 About to emit order-items-changed event:', eventData);
      socket.emit('order-items-changed', eventData);
    } else {
      console.warn('❌ Cannot emit socket event:', {
        hasSocket: !!socket,
        isConnected,
        socketId: socket?.id
      });
    }
  }, [socket, isConnected, order.orderCode, handleRefreshItems]);

  // Initial data fetch
  useEffect(() => {
    const fetchOrderItems = async () => {
      console.log('🔄 Initial fetch for order:', order.orderCode);
      setLoading(true);
      try {
        const orderItems = await OrderItemService.getOrderItems(order.orderCode);
        if (Array.isArray(orderItems)) {
          setItems(orderItems);
        } else {
          console.warn("Invalid order items response:", orderItems);
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [order.orderCode]);

  useEffect(() => {
    console.log('🔌 Socket state changed:', { isConnected, socket: socket?.id });
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('⏸️ Socket not ready, skipping listener setup. Socket:', !!socket, 'isConnected:', isConnected);
      return;
    }
    console.log('🔧 Setting up socket listeners for order:', order.orderCode);
    console.log('📡 Socket connected, ID:', socket.id);
    
    // Debug: Make socket available globally for testing
    (window as any).debugSocket = socket;
    (window as any).testRefresh = () => {
      console.log('🧪 Testing refresh-items event...');
      socket.emit('order-items-changed', { orderCode: order.orderCode, action: 'refresh' });
    };

    // Add a catch-all listener for debugging
    socket.onAny((eventName, ...args) => {
      console.log('🎯 Socket received event:', eventName, args);
    });
    
    socket.emit('join-order', order.orderCode);
    socket.on('joined-order', (confirmedOrderCode: string) => {
      console.log('✅ Confirmed joined order room:', confirmedOrderCode);
    });
    
    const handleOrderItemAdded = (newItem: any) => {
      if (!newItem || typeof newItem !== 'object' || !newItem.id) {
        console.warn('Invalid newItem received:', newItem);
        return;
      }
      
      setItems(prev => {
        const currentItems = Array.isArray(prev) ? prev : [];
        const exists = currentItems.some(item => item.id === newItem.id);
        if (exists) {
          return currentItems;
        }
        return [...currentItems, newItem];
      });
    };

    const handleOrderItemUpdated = (updatedItem: any) => {
      console.log('🔔 Socket: Order item updated:', updatedItem);
      if (!updatedItem || typeof updatedItem !== 'object' || !updatedItem.id) {
        console.warn('Invalid updatedItem received:', updatedItem);
        return;
      }
      
      setItems(prev => {
        const currentItems = Array.isArray(prev) ? prev : [];
        return currentItems.map(item => 
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        );
      });
    };

    const handleOrderItemDeleted = (deletedItemId: string) => {
      console.log('🔔 Socket: Order item deleted:', deletedItemId);
      if (!deletedItemId) {
        console.warn('Invalid deletedItemId received:', deletedItemId);
        return;
      }
      
      setItems(prev => {
        const currentItems = Array.isArray(prev) ? prev : [];
        return currentItems.filter(item => item.id !== deletedItemId);
      });
    };

    // Handle refresh items event
    const handleRefreshItemsEvent = (data: any) => {
      console.log('🔔 Socket: Received refresh-items event, data:', data);
      console.log('🔄 Triggering handleRefreshItems...');
      try {
        handleRefreshItems();
        console.log('✅ handleRefreshItems completed successfully');
      } catch (error) {
        console.error('❌ Error in handleRefreshItemsEvent:', error);
      }
    };

    // Register listeners
    socket.on('order-item-added', handleOrderItemAdded);
    socket.on('order-item-updated', handleOrderItemUpdated);  
    socket.on('order-item-deleted', handleOrderItemDeleted);
    socket.on('refresh-items', handleRefreshItemsEvent);

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('joined-order');
      socket.off('order-item-added', handleOrderItemAdded);
      socket.off('order-item-updated', handleOrderItemUpdated);
      socket.off('order-item-deleted', handleOrderItemDeleted);
      socket.off('refresh-items', handleRefreshItemsEvent);
      socket.offAny(); // Remove catch-all listener
      socket.emit('leave-order', order.orderCode);
    };
  }, [socket, isConnected, order.orderCode, handleRefreshItems]);

  const handleDelete = async (id: string) => {
    console.log('🗑️ Deleting item:', id);
    const success = await OrderItemService.deleteOrderItems(id, order.orderCode);
    if (success && socket && isConnected) {
      console.log('📡 Emitting order-items-changed for delete');
      socket.emit('order-items-changed', {
        orderCode: order.orderCode,
        meta: {},
        _id: id,  
        action: 'deleted'
      });
    }
    handleRefreshItems();
  };

  const handleEdit = (item: OrderItem) => {
    setEditItem(item);
  };

  const handleEditClose = () => {
    setEditItem(null);
  };

  if (loading) {
    return (
      <Layout home={false} seo={{ title: `Loading ${order.title}` }}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout home={false} seo={{ title: order.title }}>
      <Box sx={{ padding: 3 }}>
        {/* Socket Connection Status */}
        <Alert 
          severity={isConnected ? "success" : "warning"} 
          sx={{ mb: 2 }}
        >
          {isConnected ? `🟢 Connected (${socket?.id})` : "🔴 Disconnected"}
        </Alert>

        <Typography variant="h4" gutterBottom>
          {order.title}
        </Typography>
        
        {order.drinkLink && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {order.drinkLink}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <FormDialog 
            orderCode={order.orderCode} 
            drinkOptions={drinkOptions}
            rFunc={handleRefreshItemsWithSocket}
          />
          <Button
            variant="outlined"
            onClick={handleRefreshItems}
          >
            🔄 Refresh
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Drink</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.drink}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(item)}
                        size="small"
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {editItem && (
          <FormEditDialog
            open={!!editItem}
            item={editItem}
            orderCode={order.orderCode}
            drinkOptions={drinkOptions}
            onClose={handleEditClose}
            rFunc={handleRefreshItemsWithSocket}
          />
        )}
      </Box>
    </Layout>
  );
}