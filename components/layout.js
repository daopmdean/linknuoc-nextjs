"use client";

import { AppBar, Toolbar, Typography } from '@mui/material';
import LanguageSwitcher from '../src/components/LanguageSwitcher';
import styles from "./layout.module.css";
import SEO from './SEO';
import { useRouter } from 'next/navigation';

export default function Layout({ children, home, seo }) {

  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.layoutWrapper}>
      <SEO {...seo} />
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component="div" 
            onClick={handleLogoClick}
            sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            Linknuoc
          </Typography>
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  );
}
