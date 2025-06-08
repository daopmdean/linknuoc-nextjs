import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const statusOptions = [
  'draft',
  'active',
  'processing',
  'completed',
  'archived',
];

export default function CreateOrderPage() {
  const [form, setForm] = useState({
    title: '',
    note: '',
    status: 'draft',
    drinkLink: '',
    deadline: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, deadline: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to create order
    console.log('Order form data:', form);
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Tiêu đề"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Trạng thái"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Link menu nước"
                  name="drinkLink"
                  value={form.drinkLink}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Hạn chót đặt nước"
                    value={form.deadline}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                  Tạo đơn
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
} 