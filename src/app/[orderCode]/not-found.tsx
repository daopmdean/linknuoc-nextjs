import Layout from "../../components/Layout";
import { Typography, Box, Paper } from "@mui/material";

export default function NotFound() {
  return (
    <Layout home={false} seo={{ title: "Không tìm thấy đơn nước - Linknuoc" }}>
      <Box maxWidth="md" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            404 - Không tìm thấy đơn nước
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Đơn nước này không tồn tại hoặc đã bị xóa.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
