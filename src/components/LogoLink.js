"use client";

import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LogoLink() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <Typography
      variant="h6"
      component="div"
      onClick={handleLogoClick}
      sx={{
        color: "primary.main",
        fontWeight: "bold",
        cursor: "pointer",
        "&:hover": {
          opacity: 0.8,
        },
      }}
    >
      Linknuoc
    </Typography>
  );
}
