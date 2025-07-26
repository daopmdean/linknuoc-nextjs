import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Layout from '../components/layout';
import MenuService from '../services/MenuService';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [menus, setMenus] = useState([]);
  // Placeholder for orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
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
        setMenus(menusRes.data.filter(menu => menu.username === user.username));
      }
    }
    if (user.username) {
      fetchMenus();
    }
  }, [user.username]);

  return (
    <Layout>
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
                Đơn nước của bạn
              </Typography>
              {/* Placeholder for orders */}
              <Typography variant="body2" color="text.secondary">Tính năng này sẽ sớm có!</Typography>
            </>
          ) : (
            <Typography variant="body2" color="error">Bạn chưa đăng nhập.</Typography>
          )}
        </Paper>
      </Box>
    </Layout>
  );
} 