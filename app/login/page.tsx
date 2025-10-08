"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
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
import Layout from "../../components/layout";
import LoginService from "../../services/LoginService";

interface LoginForm {
  username: string;
  password: string;
}

function LoginContent() {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await LoginService.login(form.username, form.password);
      Cookies.set("token", token, { expires: 7 }); // Save token for 7 days
      router.push(redirectUrl || "/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <Layout seo={{}} home={false}>
      <Box maxWidth="sm" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            Đăng nhập
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
              <Typography
                variant="body2"
                align="left"
                fontStyle="italic"
                sx={{ mb: 1 }}
              >
                Chưa có tài khoản?{" "}
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleRegisterClick}
                >
                  Đăng ký tại đây!
                </span>
              </Typography>
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
                  "Đăng nhập"
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Layout seo={{}} home={false}>
        <Box maxWidth="sm" mx="auto" mt={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          </Paper>
        </Box>
      </Layout>
    }>
      <LoginContent />
    </Suspense>
  );
}
