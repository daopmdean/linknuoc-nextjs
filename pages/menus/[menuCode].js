import Head from "next/head";
import Layout from "../components/layout";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { getMenuRes } from "../../services/MenuService";

export async function getServerSideProps({ params }) {
  const menuRes = await getMenuRes(params.menuCode);
  if (menuRes.status !== "SUCCESS") {
    return {
      notFound: true,
    };
  }

  const menuItems = await getMenuItems(menuRes.data.menuCode);

  return {
    props: {
      menu: menuRes.data,
      items: menuItems,
    },
  };
}

export default function OrderPage(props) {
  const [menu, setMenu] = useState(props.menu);
  const [items, setItems] = useState(props.items);

  return (
    <Layout>
      <Head>
        <title>Link nước</title>
      </Head>
      <article>
        <h1>
          <i>{menu.title}</i>
        </h1>
        <h1>
          Link menu ở đây:{" "}
          <a href={menu.drinkLink} target="_blank">
            {menu.drinkLink}
          </a>
        </h1>

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </article>
    </Layout>
  );
}
