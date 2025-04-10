import styles from "./layout.module.css";
import SEO from './SEO';

export default function Layout({ children, home, seo }) {
  return (
    <div className={styles.layoutWrapper}>
      <SEO {...seo} />
      <main>{children}</main>
    </div>
  );
}
