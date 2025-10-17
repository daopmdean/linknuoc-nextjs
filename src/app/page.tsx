import Link from "next/link";
import { Typography } from "@mui/material";
import { useTranslations } from 'next-intl';
import styles from "@/styles/Home.module.css";
import Footer from "@/src/components/Footer";
import UserWelcome from "@/src/components/UserWelcome";


export default function Home() {
  const t = useTranslations('homepage');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <img
          src="/image-nobackground.png"
          alt="Linknuoc Logo"
          style={{ display: 'block', margin: '0 auto', maxWidth: 320, marginBottom: 16 }}
        />
        <Typography variant="h2" fontWeight={700} textAlign="center" mb={2} color="primary.main"> 
          {t('title')}
        </Typography>

        <UserWelcome />

        <p className={styles.description}>
          {t('description')}
        </p>

        <div className={styles.grid}>
          <Link href="/create-order" className={styles.card}>
            <h3>{t('createLinkCard.title')} &rarr;</h3>
            <p>{t('createLinkCard.description')}</p>
          </Link>

          <Link href="/menus" className={styles.card}>
            <h3>{t('createMenuCard.title')} &rarr;</h3>
            <p>{t('createMenuCard.description')}</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
