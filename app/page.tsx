import Link from "next/link";
import { Typography } from "@mui/material";
import styles from "@/styles/Home.module.css";
import Footer from "@/components/footer";
import UserWelcome from "@/components/user-welcome";


export default function Home() {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <img
          src="/image-nobackground.png"
          alt="Linknuoc Logo"
          style={{ display: 'block', margin: '0 auto', maxWidth: 320, marginBottom: 16 }}
        />
        <Typography variant="h2" fontWeight={700} textAlign="center" mb={2} color="primary.main"> 
          Chào mừng đến với Linknuoc
        </Typography>

        <UserWelcome />

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
  );
}
