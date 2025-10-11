"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import Cookies from "js-cookie";
import Layout from "../../components/layout";
import LoginService from "../../services/LoginService";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  fullName: string;
  address: string;
  dob: string;
}

interface RegisterResponse {
  token: string;
  user?: any;
}

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const tCommon = useTranslations('common');
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    fullName: "",
    address: "",
    dob: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t('passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const response: RegisterResponse = await LoginService.register(form);
      Cookies.set("token", response.token, { expires: 7 });
      router.push("/");
    } catch (err) {
      setError((err as Error).message || tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const seo = {
    title: "Đăng ký - Linknuoc",
    description: "Đăng ký tài khoản mới để sử dụng dịch vụ Linknuoc.",
    url: "https://linknuoc.com/register",
  };

  return (
    <Layout seo={seo} home={false}>
      <Box maxWidth="sm" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            {t('title')}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label={t('username')}
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label={t('password')}
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
                label={t('confirmPassword')}
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
                label={t('email')}
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
                label={t('phone')}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label={t('fullName')}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label={t('address')}
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
              />
              <TextField
                label={t('dob')}
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                fullWidth
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
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('submitButton')
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
}
