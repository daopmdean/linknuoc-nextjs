"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Link,
} from "@mui/material";
import Layout from "../../../components/layout";
import MenuService from "../../../services/MenuService";
import MenuItemService from "../../../services/MenuItemService";

interface MenuItem {
  id: number;
  itemName: string;
  drink: string;
  size: string;
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !menu) {
    return (
      <Layout seo={seo} home={false}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6" color="error">
            {error || "Menu not found"}
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout seo={seo} home={false}>
      <Box component="article" p={3}>
        <Typography variant="h4" component="h1" gutterBottom fontStyle="italic">
          {menu.title}
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Link menu ở đây:{" "}
          <Link 
            href={menu.drinkLink} 
            target="_blank" 
            rel="noopener noreferrer"
            color="primary"
          >
            {menu.drinkLink}
          </Link>
        </Typography>

        {!items || items.length === 0 ? (
          <Typography variant="body1" fontStyle="italic" color="text.secondary">
            No drink yet
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Nước</TableCell>
                <TableCell>Size</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.drink}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Layout>
  );
}