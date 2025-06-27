import Head from "next/head";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Layout from "../../components/layout";
import MenuService from "../../services/MenuService";

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

  return (
    <Layout>
      <Head>
        <title>Menus</title>
      </Head>
      <article>
        {menus == null ? (
          <i>No drink yet</i>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Link Nước</TableCell>
                <TableCell>Owner</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menus?.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.menuName}</TableCell>
                  <TableCell>{menu.menuLink}</TableCell>
                  <TableCell>{menu.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </article>
    </Layout>
  );
}
