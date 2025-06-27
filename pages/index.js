import Link from "next/link";
import styles from "../styles/Home.module.css";
import Layout from '../components/layout';
import Footer from "../components/footer";

export default function Home() {
  
  const seo = {
    title: 'Linknuoc - Chia sẻ link nước đến với bạn bè & đồng nghiệp',
    description: 'Nền tảng chia sẻ link nước và tạo menu đồ uống cho bạn bè và đồng nghiệp của bạn.',
    url: 'https://linknuoc.com',
  };

  return (
    <Layout seo={seo}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Chào mừng đến với Linknuoc!</h1>

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
