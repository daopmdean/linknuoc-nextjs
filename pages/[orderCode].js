import moment from "moment";
import Head from "next/head";
import Layout from "../components/layout";
import { deleteOrderItems, getOrderItems } from "../services/OrderItemService";
import DeleteIcon from "@mui/icons-material/Delete";
import FormDialog from "../components/form-dialog";
import FormEditDialog from "../components/form-edit-dialog";
import { useEffect, useState } from "react";
import { getOrderRes } from "../services/OrderService";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export async function getServerSideProps({ params }) {
  const orderRes = await getOrderRes(params.orderCode);
  if (orderRes.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const orderItems = await getOrderItems(orderRes.data[0].orderCode);

  return {
    props: {
      order: orderRes.data,
      items: orderItems,
    },
  };
}

export default function OrderPage(props) {
  const [order, setOrder] = useState(props.order);
  const [items, setItems] = useState(props.items);

  const handleDelete = async (id) => {
    await deleteOrderItems(id);
  };

  const handleRefreshItems = async () => {
    const orderItems = await getOrderItems(order.orderCode);
    setItems(orderItems);
  };

  return (
    <Layout>
      <Head>
        <title>Link nước</title>
      </Head>
      <article>
        <h1>
          <i>{order.title}</i>
        </h1>
        <h1>
          Link menu ở đây:{" "}
          <a href={order.drinkLink} target="_blank">
            {order.drinkLink}
          </a>
        </h1>
        {order?.deadline && (
          <h1>
            Link sẽ đóng vào lúc{" "}
            {moment(order?.deadline).format("HH:mm:ss DD/MM/YYYY")}
          </h1>
        )}
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <FormDialog
              orderCode={order.orderCode}
              rFunc={handleRefreshItems}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                handleRefreshItems();
              }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>

        {items == null ? (
          <i>No drink yet</i>
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
              {items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.drink}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    <FormEditDialog item={item} rFunc={handleRefreshItems} />{" "}
                    <DeleteIcon
                      onClick={async () => {
                        if (confirm("Sure to delete?") == true) {
                          await handleDelete(item.id);
                          handleRefreshItems();
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </article>
    </Layout>
  );
}
