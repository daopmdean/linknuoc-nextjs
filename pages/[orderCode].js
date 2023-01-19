import moment from "moment";
import Head from "next/head";
import Layout from "../components/layout";
import { deleteOrderItems, getOrderItems } from "../services/OrderItemService";
import DeleteIcon from "@mui/icons-material/Delete";
import FormDialog from "../components/form-dialog";
import FormEditDialog from "../components/form-edit-dialog";
import { useEffect, useState } from "react";
import { getOrderRes } from "../services/OrderService";
import { Button } from "@mui/material";

export async function getServerSideProps({ params }) {
  const orderRes = await getOrderRes(params.orderCode);
  if (orderRes.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const orderItems = await getOrderItems(orderRes.data.order_code);

  return {
    props: {
      order: orderRes.data,
      items: orderItems,
    },
  };
}

export default function OrderPage(props) {
  const [hydrated, setHydrated] = useState(false);
  const [order, setOrder] = useState(props.order);
  const [items, setItems] = useState(props.items);
  console.log(props.order.deadline);

  useEffect(async () => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const handleDelete = async (id) => {
    await deleteOrderItems(id);
  };

  const handleRefreshItems = async () => {
    const orderItems = await getOrderItems(order.order_code);
    setItems(orderItems);
  };

  return (
    <Layout>
      <Head>
        <title>Link nước</title>
      </Head>
      <article>
        <h1>{order.title}</h1>
        <h1>
          Link menu ở đây:{" "}
          <a href={order.drink_link} target="_blank">
            {order.drink_link}
          </a>
        </h1>
        {order?.deadline ? (
          <h1>
            Link sẽ đóng vào lúc{" "}
            {moment(order?.deadline).format("HH:mm:ss DD/MM/YYYY")}
          </h1>
        ) : (
          <></>
        )}
        <Button
          variant="contained"
          onClick={() => {
            handleRefreshItems();
          }}
        >
          Refresh
        </Button>
        <br />
        <FormDialog orderCode={order.order_code} rFunc={handleRefreshItems} />
        {items == null ? (
          <i>No drink yet</i>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Nước</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items?.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.drink}</td>
                  <td>{item.size}</td>
                  <td>
                    <FormEditDialog item={item} rFunc={handleRefreshItems} />{" "}
                    <DeleteIcon
                      onClick={async () => {
                        await handleDelete(item.id);
                        handleRefreshItems();
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </Layout>
  );
}
