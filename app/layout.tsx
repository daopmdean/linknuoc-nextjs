import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'Linknuoc - Chia sẻ link nước đến với bạn bè & đồng nghiệp',
  description: 'Nền tảng chia sẻ link nước và tạo menu đồ uống cho bạn bè và đồng nghiệp của bạn.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" /> */}
      </head>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
