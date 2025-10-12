'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import Layout from '@/components/layout';
import MenuService from '@/services/MenuService';
import OrderService from '@/services/OrderService';

interface User {
  username?: string;
  email?: string;
}

interface Menu {
  id: number;
  menuName: string;
  menuLink: string;
  username: string;
}

interface Order {
  orderCode: string;
  title: string;
  drinkLink: string;
  deadline?: string;
  menuCode: string;
  redirect: boolean;
  redirectLink: string;
  createdTime: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>({});
  const [menus, setMenus] = useState<Menu[]>([]);
  // Placeholder for orders
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token) as User;
        setUser(decoded || {});
      } catch (e) {
        setUser({});
      }
    }
  }, []);

  useEffect(() => {
    async function fetchMenus() {
      const menusRes = await MenuService.getMenusRes();
      if (menusRes.status === 'SUCCESS' && user.username) {
        setMenus(menusRes.data.filter((menu: Menu) => menu.username === user.username));
      }
    }

    async function fetchOrders() {
      const ordersRes = await OrderService.getMyOrderRes(5);
      if (ordersRes.status === 'SUCCESS' && user.username) {
        setOrders(ordersRes.data);
      }
    }

    if (user.username) {
      fetchMenus();
      fetchOrders();
    }
  }, [user.username]);

  return (
    <Layout home={false} seo={{ title: 'Thông tin cá nhân - Linknuoc' }}>
      <Box maxWidth="md" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            Thông tin cá nhân
          </Typography>
          {user?.username ? (
            <>
              <Typography variant="body1" mb={1}><b>Username:</b> {user.username}</Typography>
              {user.email && <Typography variant="body1" mb={1}><b>Email:</b> {user.email}</Typography>}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} mb={1} color="primary.main">
                Menu bạn quản lý
              </Typography>
              {menus.length > 0 ? (
                <Stack spacing={2}>
                  {menus.map(menu => (
                    <Paper key={menu.id} sx={{ p: 2 }}>
                      <Typography variant="subtitle1"><b>{menu.menuName}</b></Typography>
                      <Typography variant="body2">Link: <a href={menu.menuLink} target="_blank" rel="noopener noreferrer">{menu.menuLink}</a></Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Bạn chưa quản lý menu nào.</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} mb={1} color="primary.main">
                Đơn nước gần đây của bạn
              </Typography>
              {orders.length > 0 ? (
                <Stack spacing={2}>
                  {orders.map(order => (
                    <Paper key={order.orderCode} sx={{ p: 2 }}>
                      <Typography variant="subtitle1"><b>{order.title}</b></Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Mã đơn: <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>{order.orderCode}</Box>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2">
                          Menu: <Box component="span" sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            {order.menuCode}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Tạo lúc: <Box component="span" sx={{ 
                            backgroundColor: 'grey.400', 
                            color: 'white', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            {new Date(order.createdTime).toLocaleString('vi-VN')}
                          </Box>
                        </Typography>
                      </Box>
                      {order.deadline && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Hạn cuối: <Box component="span" sx={{ color: 'warning.main', fontWeight: 500 }}>
                            {new Date(order.deadline).toLocaleString('vi-VN')}
                          </Box>
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Link: <a href={`https://linknuoc.com/${order.orderCode}`} target="_blank" rel="noopener noreferrer">{`linknuoc.com/${order.orderCode}`}</a>
                      </Typography>
                      {order.redirect && order.redirectLink && (
                        <Typography variant="body2">
                          Redirect: <a href={order.redirectLink} target="_blank" rel="noopener noreferrer">{order.redirectLink}</a>
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Bạn chưa có đơn nước nào.</Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="error">Bạn chưa đăng nhập.</Typography>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
