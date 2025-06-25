import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log('Login form data:', form);
  };

  return (
    <Layout>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <Box maxWidth="sm" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            Đăng nhập
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Tên đăng nhập"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
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
              />
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Đăng nhập
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
} 