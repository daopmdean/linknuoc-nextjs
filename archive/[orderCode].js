import { useEffect, useState } from "react";
import moment from "moment";
import Head from "next/head";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import Layout from "../components/layout";
import FormDialog from "../components/form-dialog";
import FormEditDialog from "../components/form-edit-dialog";
import OrderItemService from "../services/OrderItemService";
import OrderService from '../services/OrderService';

export async function getServerSideProps({ params }) {
  const orderRes = await OrderService.getOrderRes(params.orderCode);
  if (orderRes.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const order = orderRes.data[0];
  if (order.redirect && order.redirectLink !== "") {
    return {
      redirect: {
        destination: order.redirectLink,
        permanent: false,
      },
    };
  }

  const orderItems = await OrderItemService.getOrderItems(order.orderCode) || null;
  return {
    props: {
      order: orderRes.data[0],
      items: orderItems,
    },
  };
}

export default function OrderPage(props) {
  const [order, setOrder] = useState(props.order);
  const [items, setItems] = useState(props.items);

  const handleDelete = async (id) => {
    await OrderItemService.deleteOrderItems(id);
  };

  const handleRefreshItems = async () => {
    const orderItems = await OrderItemService.getOrderItems(order.orderCode);
    setItems(orderItems);
  };

  return (
    <Layout>
      <Head>
        <title>Link nước</title>
      </Head>
      <Box maxWidth="md" mx="auto" mt={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            <i>{order.title}</i>
          </Typography>
          <Typography variant="h6" gutterBottom>
            Link menu ở đây: {" "}
            <a href={order.drinkLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
              {order.drinkLink}
            </a>
          </Typography>
          {order?.deadline && (
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Link sẽ đóng vào lúc {moment(order?.deadline).format("HH:mm:ss DD/MM/YYYY")}
            </Typography>
          )}
          <Grid container justifyContent="flex-end" spacing={2} mb={2}>
            <Grid item>
              <FormDialog orderCode={order.orderCode} menuCode={order.menuCode} rFunc={handleRefreshItems} />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefreshItems}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
          {items == null ? (
            <Typography variant="body2" color="text.secondary"><i>No drink yet</i></Typography>
          ) : (
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.08)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Tên</b></TableCell>
                    <TableCell><b>Nước</b></TableCell>
                    <TableCell><b>Size</b></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? '#fff' : '#f0f6ff',
                        transition: 'background 0.2s',
                        '&:hover': {
                          backgroundColor: '#e3f0fc',
                        },
                        '&:last-child td, &:last-child th': { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.drink}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item>
                            <FormEditDialog menuCode={order.menuCode} item={item} rFunc={handleRefreshItems} />
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="error"
                              onClick={async () => {
                                if (confirm("Sure to delete?") == true) {
                                  await handleDelete(item.id);
                                  handleRefreshItems();
                                }
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
