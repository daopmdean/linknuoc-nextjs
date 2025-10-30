"use client";

import { useState, useEffect } from "react";
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
  const [order] = useState(initialOrder);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();
  const { drinkOptions } = useMenuItems(order.menuCode);

  // Fetch order items on client side since server-side doesn't have access to auth cookies
  useEffect(() => {
    const fetchOrderItems = async () => {
      setLoading(true);
      try {
        const orderItems = await OrderItemService.getOrderItems(
          order.orderCode
        );
        
        // Ensure we always set an array
        if (Array.isArray(orderItems)) {
          setItems(orderItems);
        } else {
          console.warn("Invalid order items response:", orderItems);
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
        setItems([]); // Ensure items is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [order.orderCode]);

  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the order room for real-time updates
    console.log('🚀 Joining order room:', order.orderCode);
    socket.emit('join-order', order.orderCode);

    // Listen for real-time events
    console.log('📡 Registering socket listeners...');
    const handleOrderItemAdded = (newItem: OrderItem) => {
      console.log('Socket: New item added:', newItem);
      
      // Validate newItem before updating state
      if (!newItem || !newItem.id) {
        console.warn('Invalid newItem received:', newItem);
        return;
      }
      
      setItems(prev => {
        // Ensure prev is always an array
        const currentItems = Array.isArray(prev) ? prev : [];
        
        // Check if item already exists to avoid duplicates
        const existingItem = currentItems.find(item => item.id === newItem.id);
        if (existingItem) {
          console.log('Item already exists, skipping add');
          return currentItems;
        }
        
        return [...currentItems, newItem];
      });
    };

    const handleOrderItemUpdated = (updatedItem: OrderItem) => {
      console.log('Socket: Item updated:', updatedItem);
      
      // Validate updatedItem before updating state
      if (!updatedItem || !updatedItem.id) {
        console.warn('Invalid updatedItem received:', updatedItem);
        return;
      }
      
      setItems(prev => {
        // Ensure prev is always an array
        const currentItems = Array.isArray(prev) ? prev : [];
        return currentItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        );
      });
    };

    const handleOrderItemDeleted = (deletedItemId: string) => {
      console.log('Socket: Item deleted:', deletedItemId);
      
      // Validate deletedItemId before updating state
      if (!deletedItemId) {
        console.warn('Invalid deletedItemId received:', deletedItemId);
        return;
      }
      
      setItems(prev => {
        // Ensure prev is always an array
        const currentItems = Array.isArray(prev) ? prev : [];
        return currentItems.filter(item => item.id !== deletedItemId);
      });
    };

    // Handle refresh items event (generic refresh trigger)
    const handleRefreshItemsEvent = (action: string) => {
      console.log('🔔 Socket: Received refresh-items event, action:', action);
      handleRefreshItems(); // Simply refresh the items list
    };

    socket.on('order-item-added', handleOrderItemAdded);
    socket.on('order-item-updated', handleOrderItemUpdated);  
    socket.on('order-item-deleted', handleOrderItemDeleted);
    socket.on('refresh-items', handleRefreshItemsEvent);

    // Cleanup
    return () => {
      socket.off('order-item-added', handleOrderItemAdded);
      socket.off('order-item-updated', handleOrderItemUpdated);
      socket.off('order-item-deleted', handleOrderItemDeleted);
      socket.off('refresh-items', handleRefreshItemsEvent);
      socket.emit('leave-order', order.orderCode);
    };
  }, [socket, isConnected, order.orderCode]);

  const handleDelete = async (id: string) => {
    const success = await OrderItemService.deleteOrderItems(id, order.orderCode);
    if (success && socket && isConnected) {
      console.log('Emitting items-changed event for delete');
      // Emit generic refresh event to other clients
      socket.emit('order-items-changed', {
        orderCode: order.orderCode,
        action: 'deleted'
      });
    }
  };

  const handleRefreshItems = async () => {
    setLoading(true);
    try {
      const orderItems = await OrderItemService.getOrderItems(order.orderCode);
      
      // Ensure we always set an array
      if (Array.isArray(orderItems)) {
        setItems(orderItems);
      } else {
        console.warn("Invalid refresh response:", orderItems);
        setItems([]);
      }
    } catch (error) {
      console.error("Error refreshing items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Custom refresh function with socket emission for FormDialog (create)
  const handleRefreshItemsWithSocket = async () => {
    console.log('handleRefreshItemsWithSocket called');
    console.log('Socket state:', { socket: !!socket, isConnected, orderCode: order.orderCode });
    
    // Refresh items first
    await handleRefreshItems();
    
    // Emit a simple "refresh" event to other clients
    if (socket && isConnected) {
      console.log('✅ Emitting order-items-changed event:', {
        orderCode: order.orderCode,
        action: 'created'
      });
      socket.emit('order-items-changed', {
        orderCode: order.orderCode,
        action: 'created'
      });
    } else {
      console.log('❌ Socket not ready for emission:', { socket: !!socket, isConnected });
    }
  };

  // Custom refresh function with socket emission for FormEditDialog (update)  
  const handleRefreshItemsWithSocketUpdate = async () => {
    console.log('handleRefreshItemsWithSocketUpdate called');
    
    // Refresh items first
    await handleRefreshItems();
    
    // Emit generic refresh event to other clients
    if (socket && isConnected) {
      console.log('Emitting items-changed event for update');
      socket.emit('order-items-changed', {
        orderCode: order.orderCode,
        action: 'updated'
      });
    }
  };

  return (
    <Layout home={false} seo={{ title: `${order.title} - Link nước` }}>
      <Box maxWidth="md" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            <i>{order.title}</i>
          </Typography>
          <Typography variant="h6" gutterBottom>
            Link menu ở đây:{" "}
            <a
              href={order.drinkLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              {order.drinkLink}
            </a>
          </Typography>
          {order?.deadline && (
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Link sẽ đóng vào lúc{" "}
              {moment(order?.deadline).format("HH:mm:ss DD/MM/YYYY")}
            </Typography>
          )}
          
          {/* Real-time connection status */}
          <Alert 
            severity={isConnected ? "success" : "warning"} 
            sx={{ mb: 2 }}
          >
            {isConnected ? "🟢 DDOS hộ cái" : "⚠️ Reconnecting..."}
          </Alert>
          
          <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}>
            <FormDialog
              orderCode={order.orderCode}
              drinkOptions={drinkOptions}
              rFunc={handleRefreshItemsWithSocket}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefreshItems}
            >
              Refresh
            </Button>
          </Stack>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : items == null || items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              <i>No drink yet</i>
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={1}
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.08)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Tên</b>
                    </TableCell>
                    <TableCell>
                      <b>Nước</b>
                    </TableCell>
                    <TableCell>
                      <b>Size</b>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? "#fff" : "#f0f6ff",
                        transition: "background 0.2s",
                        "&:hover": {
                          backgroundColor: "#e3f0fc",
                        },
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.drink}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FormEditDialog
                            item={item}
                            rFunc={handleRefreshItemsWithSocketUpdate}
                            drinkOptions={drinkOptions}
                          />
                          <IconButton
                            color="error"
                            onClick={async () => {
                              if (confirm("Sure to delete?") == true) {
                                await handleDelete(item.id);
                                handleRefreshItems();
                              }
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
