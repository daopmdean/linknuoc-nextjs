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
} from "@mui/material";
import OrderItemService from "@/src/services/OrderItemService";
import { useMenuItems } from "@/src/hooks/useMenuItems";
import Layout from "@/src/components/Layout";
import FormDialog from "@/src/components/FormDialog";
import FormEditDialog from "@/src/components/FormEditDialog";

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

export default function OrderView({
  order: initialOrder,
}: OrderViewProps) {
  const [order] = useState(initialOrder);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { drinkOptions } = useMenuItems(order.menuCode);

  // Fetch order items on client side since server-side doesn't have access to auth cookies
  useEffect(() => {
    const fetchOrderItems = async () => {
      setLoading(true);
      try {
        const orderItems = await OrderItemService.getOrderItems(order.orderCode);
        setItems(orderItems);
      } catch (error) {
        console.error('Error fetching order items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [order.orderCode]);

  const handleDelete = async (id: string) => {
    await OrderItemService.deleteOrderItems(id);
  };

  const handleRefreshItems = async () => {
    setLoading(true);
    const orderItems = await OrderItemService.getOrderItems(order.orderCode);
    setItems(orderItems);
    setLoading(false);
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
          <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}>
            <FormDialog
              orderCode={order.orderCode}
              rFunc={handleRefreshItems}
              drinkOptions={drinkOptions}
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
                            rFunc={handleRefreshItems}
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
