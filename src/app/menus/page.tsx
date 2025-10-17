"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper } from "@mui/material";
import Layout from "@/src/components/Layout";
import Footer from "@/src/components/Footer";
import Loading from "@/src/components/Loading";
import MenuService from "@/src/services/MenuService";

interface Menu {
  menuCode: string;
  menuName: string;
  menuLink: string;
  username: string;
}

interface MenusResponse {
  status: string;
  data: Menu[];
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menusRes: MenusResponse = await MenuService.getMenusRes();
        if (menusRes.status === "SUCCESS") {
          setMenus(menusRes.data);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleMenuClick = (menuCode: string) => {
    router.push(`/menus/${menuCode}`);
  };

  const seo = {
    title: "Menu đồ uống - Linknuoc",
    description: "Danh sách menu đồ uống được chia sẻ trên Linknuoc.",
    url: "https://linknuoc.com/menus",
  };

  if (loading) {
    return (
      <Layout seo={seo} home={false}>
        <Loading text="Loading..." />
      </Layout>
    );
  }

  return (
    <Layout seo={seo} home={false}>
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default"
      >
        <Box
          component="main"
          py={8}
          width="100%"
          maxWidth="900px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            mb={2}
            color="primary.main"
          >
            Danh sách Menu đồ uống
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Khám phá các menu đồ uống được chia sẻ bởi cộng đồng Linknuoc
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {menus && menus.length > 0 ? (
              menus.map((menu) => (
                <Box
                  key={menu.menuCode}
                  onClick={() => handleMenuClick(menu.menuCode)}
                  sx={{
                    flex: "1 1 260px",
                    maxWidth: 350,
                    minWidth: 260,
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: "100%",
                      minWidth: 260,
                      maxWidth: 350,
                      p: 3,
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": {
                        boxShadow: 8,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      mb={1}
                      color="primary.main"
                    >
                      {menu.menuName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Người tạo menu: <b>{menu.username}</b>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ wordBreak: "break-all", mb: 2 }}
                    >
                      <a
                        href={menu.menuLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1976d2",
                          textDecoration: "underline",
                        }}
                      >
                        {menu.menuLink}
                      </a>
                    </Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                <i>Chưa có menu nào</i>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Layout>
  );
}
