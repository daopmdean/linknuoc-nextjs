import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../components/layout';
import LoginService from '../services/LoginService';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    fullName: '',
    address: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu và Nhập lại mật khẩu không khớp.');
      setLoading(false);
      return;
    }

    try {
      const { token } = await LoginService.register(form);
      Cookies.set('token', token, { expires: 7 });
      router.push('/');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Đăng ký</title>
      </Head>
      <Box maxWidth="sm" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            Đăng ký
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Tên đăng nhập"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Mật khẩu"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Họ và tên"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Địa chỉ"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label="Ngày sinh"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
} 