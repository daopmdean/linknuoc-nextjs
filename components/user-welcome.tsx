"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { Typography } from "@mui/material";

interface User {
  username?: string;
  [key: string]: any;
}

interface DecodedToken {
  username: string;
  [key: string]: any;
}
  
export default function UserWelcome() {
  const [user, setUser] = useState<User>({});
  
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded || {});
      } catch (e) {
        console.log("error", e);
        setUser({});
      }
    }
  }, []);

  const handleProfileClick = (): void => {
    window.location.href = '/profile';
  };

  return (
    <>
      {user?.username && (
        <Typography variant="h6" textAlign="center" color="primary.main" mb={2}>
          Xin chào <b style={{ cursor: 'pointer' }} onClick={handleProfileClick}>{user.username}</b>! Cùng tạo link nước thôi...
        </Typography>
      )}
    </>
  );
}
