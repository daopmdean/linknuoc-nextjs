import axios from "axios";
import moment from "moment";
import Head from "next/head";
import Layout from "../components/layout";

// const url = "https://linknuoc-go-xhj5h5a4za-as.a.run.app";
const url = "http://localhost:1314";

export async function getServerSideProps({ params }) {
  const orderRes = await axios.get(`${url}/orders/${params.orderCode}`);
  if (orderRes.data.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const orderItemRes = await axios.get(
    `${url}/orders/${params.orderCode}/items`
  );
  console.log(orderItemRes.data.data);

  return {
    props: {
      order: orderRes.data.data,
      items: orderItemRes.data.data,
    },
  };
}

export default function OrderPage(props) {
  const { order, items } = props;
  // console.log(items);

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
          Link đóng vào lúc:{" "}
          {moment(order.deadline).format("DD/MM/YYYY HH:mm:ss")}
        </h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Drink</th>
              <th>Size</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.drink}</td>
                <td>{item.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </Layout>
  );
}
