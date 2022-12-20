export async function getStaticPaths() {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: false,
  };
}

export async function getStaticProps() {
  const order = [];

  return {
    props: {
      postData: order,
    },
  };
}

export default function OrderPage({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
