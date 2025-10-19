import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      width="100%"
      height="64px"
      borderTop={1}
      borderColor="#eaeaea"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="body2" color="text.secondary">
        <a
          href="https://box-api.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Powered by box-api.com
        </a>
      </Typography>
    </Box>
  );
}
