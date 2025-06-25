import { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../components/layout';
import OrderService from '../services/OrderService';

export default function CreateOrderPage() {
  const [form, setForm] = useState({
    title: '',
    note: '',
    drinkLink: '',
    deadline: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, deadline: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Call API to create order
    console.log('Order form data:', form);

    try {
      const { token } = await OrderService.login(form.username, form.password);
      Cookies.set('token', token, { expires: 7 }); // Save token for 7 days
      router.push('/'); // Redirect to homepage on success
    } catch (err) {
    } finally {
    }
  };

  return (
    <Layout>
      <Head>
        <title>Tạo đơn nước mới</title>
      </Head>
      <Box maxWidth="sm" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            Tạo đơn nước mới
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Tiêu đề"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Ghi chú"
                name="note"
                value={form.note}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
              />
              <TextField
                label="Link menu nước"
                name="drinkLink"
                value={form.drinkLink}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Hạn chót đặt nước"
                  value={form.deadline}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                />
              </LocalizationProvider>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Tạo đơn
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
} 