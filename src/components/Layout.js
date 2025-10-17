import { AppBar, Toolbar } from '@mui/material';
import LanguageSwitcher from './LanguageSwitcher';
import LogoLink from './LogoLink';
import styles from "./layout.module.css";
import SEO from './SEO';

export default function Layout({ children, home, seo }) {
  return (
    <div className={styles.layoutWrapper}>
      <SEO {...seo} />
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <LogoLink />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  );
}
