"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Link,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Alert,
  Stack,
  CardMedia,
} from "@mui/material";
import Layout from "@/components/layout";
import Loading from "@/components/loading";
import MenuService from "@/services/MenuService";
import MenuItemService from "@/services/MenuItemService";

interface MenuItem {
  id: number;
  itemName: string;
  drink: string;
  drinkSize?: string[];
  sugarRate?: string[];
  imageLink?: string;
  category?: string;
  note?: string;
}

interface Menu {
  id: number;
  title: string;
  drinkLink: string;
  menuCode: string;
  menuName: string;
  menuLink: string;
  username: string;
}

interface MenuResponse {
  status: string;
  data: Menu[];
  message?: string;
}

interface MenuPageProps {
  params: {
    menuCode: string;
  };
}

export default function MenuPage({ params }: MenuPageProps) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu data
        const menuRes: MenuResponse = await MenuService.getMenuRes(params.menuCode);
        if (menuRes.status !== "SUCCESS") {
          setError("Menu not found");
          return;
        }

        const menuData = menuRes.data[0];
        setMenu(menuData);

        // Fetch menu items
        const menuItems = await MenuItemService.getMenuItems(menuData.menuCode || params.menuCode);
        setItems(menuItems || []);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Error loading menu data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.menuCode]);

  const seo = {
    title: menu ? `${menu.title} - Linknuoc` : 'Xem Menu - Linknuoc',
    description: menu ? `Xem chi tiết menu ${menu.title}` : 'Xem chi tiết menu đồ uống',
    url: `https://linknuoc.com/menus/${params.menuCode}`,
  };

  if (loading) {
    return (
      <Layout seo={seo} home={false}>
        <Loading text="Đang tải menu..." />
      </Layout>
    );
  }

  if (error || !menu) {
    return (
      <Layout seo={seo} home={false}>
        <Container maxWidth="lg">
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="60vh"
            px={2}
          >
            <Alert severity="error" sx={{ maxWidth: 400, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Oops! Có lỗi xảy ra
              </Typography>
              <Typography variant="body2">
                {error || "Không tìm thấy menu"}
              </Typography>
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout seo={seo} home={false}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4, px: 2 }}>
          {/* Header Section */}
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main',
                  textAlign: 'center',
                  mb: 3
                }}
              >
                {menu.title}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  🔗 Link menu gốc:
                </Typography>
                <Link 
                  href={menu.menuLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 'medium',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {menu.menuLink}
                </Link>
              </Box>
            </CardContent>
          </Card>

          {/* Menu Items Section */}
          <Card elevation={2}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
                  📋 Danh sách đồ uống
                </Typography>
              </Box>
              
              {!items || items.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                  >
                    🥤 Chưa có đồ uống nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Menu này hiện chưa có món nào được thêm vào
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                      },
                      gap: 3
                    }}
                  >
                    {items.map((item, index) => (
                      <Card 
                        key={item.id}
                        elevation={2}
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            elevation: 4,
                            transform: 'translateY(-4px)',
                            boxShadow: 3
                          }
                        }}
                      >
                        {item.imageLink && (
                          <CardMedia
                            component="img"
                            height="200"
                            image={item.imageLink}
                            alt={item.itemName}
                            sx={{ 
                              objectFit: 'cover',
                              backgroundColor: 'grey.100'
                            }}
                            onError={(e) => {
                              // Hide image if it fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {/* Item Name */}
                          <Typography 
                            variant="h6" 
                            component="h3" 
                            gutterBottom
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.main',
                              mb: 2
                            }}
                          >
                            {item.itemName}
                          </Typography>

                          {/* Category */}
                          {item.category && (
                            <Box sx={{ mb: 1.5 }}>
                              <Chip 
                                label={item.category}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{ fontWeight: 'medium' }}
                              />
                            </Box>
                          )}

                          {/* Drink and Size */}
                          <Stack spacing={1} sx={{ mb: 2 }}>
                            <Typography variant="body1" color="text.primary">
                              <strong>🥤 Đồ uống:</strong> {item.drink}
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              <strong>📏 Size:</strong> {item.drinkSize}
                            </Typography>
                          </Stack>

                          {/* Note */}
                          {item.note && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>📝 Ghi chú:</strong> {item.note}
                              </Typography>
                            </Box>
                          )}

                          {/* Status */}
                          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Chip 
                              label="✅ Có sẵn" 
                              size="small" 
                              color="success" 
                              sx={{ 
                                fontWeight: 'medium',
                                width: '80%'
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Footer Info */}
          {menu && items.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Tổng cộng: <strong>{items.length}</strong> đồ uống
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
}