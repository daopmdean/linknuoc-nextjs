import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập - Linknuoc",
  description: "Đăng nhập vào Linknuoc để tạo và quản lý link nước của bạn.",
  openGraph: {
    title: "Đăng nhập - Linknuoc",
    description: "Đăng nhập vào Linknuoc để tạo và quản lý link nước của bạn.",
    url: "https://linknuoc.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
