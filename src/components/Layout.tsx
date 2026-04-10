import { AppBar, Toolbar } from "@mui/material";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoLink from "./LogoLink";
import styles from "./layout.module.css";
import SEO, { SEOProps } from "./SEO";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  home?: boolean;
  seo?: SEOProps;
}

export default function Layout({ children, home, seo }: LayoutProps) {
  return (
    <div className={styles.layoutWrapper}>
      {seo && <SEO {...seo} />}
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <LogoLink />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  );
}