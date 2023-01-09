import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { API_URL } from "../common/constant";
import Layout from "../components/layout";
import { deleteOrderItems, getOrderItems } from "../services/OrderItemService";
import DeleteIcon from "@mui/icons-material/Delete";
import FormDialog from "../components/form-dialog";
import FormEditDialog from "../components/form-edit-dialog";
import { useEffect, useState } from "react";

export async function getServerSideProps({ params }) {
  const orderFetchRes = await fetch(`${API_URL}/orders/${params.orderCode}`);
  const orderRes = await orderFetchRes.json();
  if (orderRes.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const orderItems = await getOrderItems(orderRes.data.order_code);
  console.log(orderItems);

  return {
    props: {
      order: orderRes.data,
      items: orderItems,
    },
  };
}

export default function OrderPage(props) {
  const { order, items } = props;
  // const [items, setItems] = useState([]);

  // useEffect(async () => {
  //   const orderItems = await getOrderItems(order.orderCode);
  //   setItems(orderItems);
  //   console.log("loaded...", items);
  // }, []);

  const handleDelete = (id) => {
    deleteOrderItems(id);
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
        <h1>
          Link sẽ đóng vào lúc{" "}
          {moment(order.deadline).format("HH:mm:ss DD/MM/YYYY")}
        </h1>
        <FormDialog orderCode={order.order_code} />
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
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.drink}</td>
                <td>{item.size}</td>
                <td>
                  <FormEditDialog item={item} />{" "}
                  <DeleteIcon
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </Layout>
  );
}
