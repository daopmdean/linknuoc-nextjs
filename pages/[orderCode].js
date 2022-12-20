import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { API_URL } from "../common/constant";
import Layout from "../components/layout";
import { getOrderItems } from "../services/OrderItemService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FormDialog from "../components/form-dialog";

export async function getServerSideProps({ params }) {
  const orderRes = await axios.get(`${API_URL}/orders/${params.orderCode}`);
  if (orderRes.data.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const orderItems = await getOrderItems(params.orderCode);

  return {
    props: {
      order: orderRes.data.data,
      items: orderItems,
    },
  };
}

export default function OrderPage(props) {
  const { order, items } = props;

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
                  <EditIcon /> <DeleteIcon />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </Layout>
  );
}
