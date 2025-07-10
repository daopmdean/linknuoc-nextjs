import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Checkbox, // Add Checkbox import
  FormControlLabel, // Add FormControlLabel import
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../components/layout';
import OrderService from '../services/OrderService';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function CreateOrderPage() {
  const [form, setForm] = useState({
    title: '',
    note: '',
    drinkLink: '',
    deadline: null,
    redirect: false, // Add redirect field
    redirectLink: '', // Add redirectLink field
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOrderLink, setShowOrderLink] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, deadline: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate deadline
    if (form.deadline && new Date(form.deadline) < new Date()) {
      setError('Hạn chót đặt nước phải ở tương lai.');
      setLoading(false);
      return;
    }

    try {
      const { orderCode } = await OrderService.createOrder(form);
      if (form.redirect && form.redirectLink) {
        setCreatedOrderCode(orderCode);
        setShowOrderLink(true);
      } else {
        router.push('/'+orderCode); // Redirect to order page
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
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
          {!isAuthenticated && (
            <Tooltip title="click vào đây để chuyển sang trang đăng nhập" placement="bottom" arrow>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer', mb: 2, display: 'inline-flex' }} onClick={() => router.push('/login')}>
                <InfoOutlineIcon />
                <Typography
                  variant="body2"
                  fontStyle="italic"
                  color="text.secondary"
                >
                  Click vào đây để đăng nhập và tạo link nước
                </Typography>
              </Stack>
            </Tooltip>
          )}
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
                disabled={loading}
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
                disabled={loading}
              />
              <TextField
                label="Link menu nước"
                name="drinkLink"
                value={form.drinkLink}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="redirect"
                    checked={form.redirect}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Chuyển tiếp tới link khác"
              />
              {form.redirect && (
                <TextField
                  label="Link cần chuyển tiếp"
                  name="redirectLink"
                  value={form.redirectLink}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                />
              )}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Hạn chót đặt nước"
                  value={form.deadline}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" disabled={loading} />}
                  disabled={loading}
                />
              </LocalizationProvider>
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading}>
                Tạo đơn
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
      <Dialog open={showOrderLink} onClose={() => setShowOrderLink(false)}>
        <DialogTitle>Đơn nước đã được tạo thành công!</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Link nước của bạn là
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" fontWeight={700} sx={{ wordBreak: 'break-all' }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/${createdOrderCode}` : `/${createdOrderCode}`}
            </Typography>
            <IconButton size="small" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/${createdOrderCode}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            {copied && <Typography variant="caption" color="success.main">Đã copy!</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.push('/'+createdOrderCode)} color="primary" variant="contained">
            Đi tới đơn nước
          </Button>
          <Button onClick={() => setShowOrderLink(false)} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 
