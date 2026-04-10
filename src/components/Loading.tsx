import { Typography, Box, CircularProgress, Container } from "@mui/material";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Đang tải..." }: LoadingProps) {
  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          {text}
        </Typography>
      </Box>
    </Container>
  );
}
