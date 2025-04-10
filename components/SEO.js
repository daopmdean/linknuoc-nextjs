import Head from 'next/head';

export default function SEO({ 
  title = 'Linknuoc - Chia sẻ link nước đến với bạn bè & đồng nghiệp',
  description = 'Nền tảng chia sẻ link nước và tạo menu đồ uống cho bạn bè và đồng nghiệp của bạn.',
  image = '/og-image.jpg',
  url = 'https://linknuoc.com',
  type = 'website',
}) {
  const siteTitle = title === 'Linknuoc' ? title : `${title} | Linknuoc`;

  return (
    <Head>
      {/* Basic meta tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="language" content="Vietnamese" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Additional meta tags */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Head>
  );
} 