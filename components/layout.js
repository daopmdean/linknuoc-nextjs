import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import LanguageSwitcher from '../src/components/LanguageSwitcher';
import styles from "./layout.module.css";
import SEO from './SEO';

export default function Layout({ children, home, seo }) {
  return (
    <div className={styles.layoutWrapper}>
      <SEO {...seo} />
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Linknuoc
          </Typography>
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  );
}
