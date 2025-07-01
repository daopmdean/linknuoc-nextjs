import Link from "next/link";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import styles from "../styles/Home.module.css";
import Layout from '../components/layout';
import Footer from "../components/footer";

export default function Home() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded || decoded || {});
      } catch (e) {
        console.log("error", e);
        setUser({});
      }
    }
  }, []);

  const seo = {
    title: 'Linknuoc - Chia sẻ link nước đến với bạn bè & đồng nghiệp',
    description: 'Nền tảng chia sẻ link nước và tạo menu đồ uống cho bạn bè và đồng nghiệp của bạn.',
    url: 'https://linknuoc.com',
  };

  return (
    <Layout seo={seo}>
      <div className={styles.container}>
        <main className={styles.main}>
          <img
            src="/image.png"
            alt="Linknuoc Logo"
            style={{ display: 'block', margin: '0 auto', maxWidth: 160, marginBottom: 16 }}
          />
          <Typography variant="h2" fontWeight={700} textAlign="center" mb={2} color="primary.main"> 
            Chào mừng đến với Linknuoc
          </Typography>
          {user?.username && (
            <Typography variant="h6" textAlign="center" color="primary.main" mb={2}>
              Xin chào <b>{user.username}</b>! Cùng tạo link nước thôi...
            </Typography>
          )}
          

          <p className={styles.description}>
            Nơi chia sẻ link nước đến với bạn bè & đồng nghiệp
          </p>

          <div className={styles.grid}>
            <Link href="/create-order" className={styles.card}>
              <h3>Tạo Link &rarr;</h3>
              <p>Tạo link nước và gửi đến với mọi người</p>
            </Link>

            <Link href="/menus" className={styles.card}>
              <h3>Tạo menu &rarr;</h3>
              <p>Làm một cái menu hoành xì tráng đẹp mắt!</p>
            </Link>
          </div>
        </main>

        <Footer />

      </div>
    </Layout>
  );
}
