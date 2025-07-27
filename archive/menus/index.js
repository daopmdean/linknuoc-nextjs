import { useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Layout from "../../components/layout";
import MenuService from "../../services/MenuService";
import Footer from "../../components/footer";

export async function getServerSideProps({ params }) {
  const menusRes = await MenuService.getMenusRes();
  if (menusRes.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      menus: menusRes.data,
    },
  };
}

export default function MenusPage(props) {
  const [menus, setMenus] = useState(props.menus);

  const seo = {
    title: 'Menu đồ uống - Linknuoc',
    description: 'Danh sách menu đồ uống được chia sẻ trên Linknuoc.',
    url: 'https://linknuoc.com/menus',
  };

  return (
    <Layout seo={seo}>
      <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="background.default">
        <Box component="main" py={8} width="100%" maxWidth="900px" display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={2} color="primary.main">
            Danh sách Menu đồ uống
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" mb={4}>
            Khám phá các menu đồ uống được chia sẻ bởi cộng đồng Linknuoc
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            {menus && menus.length > 0 ? (
              menus.map((menu) => (
                <Grid
                  item
                  key={menu.id}
                  xs={12}
                  sm={6}
                  md={5}
                  lg={4}
                  display="flex"
                  justifyContent="center"
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: '100%',
                      minWidth: 260,
                      maxWidth: 350,
                      p: 3,
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 8,
                      },
                    }}
                  >
                    <Typography variant="h5" fontWeight={600} mb={1} color="primary.main">
                      {menu.menuName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Người tạo menu: <b>{menu.username}</b>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ wordBreak: 'break-all', mb: 2 }}
                    >
                      <a href={menu.menuLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                        {menu.menuLink}
                      </a>
                    </Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary"><i>Chưa có menu nào</i></Typography>
            )}
          </Grid>
        </Box>
        <Footer />
      </Box>
    </Layout>
  );
}
