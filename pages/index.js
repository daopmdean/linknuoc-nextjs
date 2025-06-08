import Link from "next/link";
import styles from "../styles/Home.module.css";
import Layout from '../components/layout';

export default function Home() {
  const seo = {
    title: 'Linknuoc - Chia sẻ link nước đến với bạn bè & đồng nghiệp',
    description: 'Nền tảng chia sẻ link nước và tạo menu đồ uống cho bạn bè và đồng nghiệp của bạn.',
    url: 'https://linknuoc.com',
  };

  return (
    <Layout seo={seo}>
      <div className={styles.container}>
        <main>
          <h1 className={styles.title}>Chào mừng đến với Linknuoc!</h1>

          <p className={styles.description}>
            Nơi chia sẻ link nước đến với bạn bè & đồng nghiệp
          </p>

          <div className={styles.grid}>
            <Link href="/create-link" className={styles.card}>
              <h3>Tạo Link &rarr;</h3>
              <p>Tạo link nước và gửi đến với mọi người</p>
            </Link>

            <Link href="/menus" className={styles.card}>
              <h3>Tạo menu &rarr;</h3>
              <p>Làm một cái menu hoành xì tráng đẹp mắt!</p>
            </Link>
          </div>
        </main>

        <footer>
          <a
            href="https://box-api.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by box-api.com
          </a>
        </footer>

        <style jsx>{`
          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          footer img {
            margin-left: 0.5rem;
          }
          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            color: inherit;
          }
          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </Layout>
  );
}
