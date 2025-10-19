import { notFound, redirect } from "next/navigation";
import OrderView from "./OrderView";
import OrderService from "@/src/services/OrderService";

interface PageProps {
  params: {
    orderCode: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const orderRes = await OrderService.getOrderRes(params.orderCode);

  if (orderRes.status !== "SUCCESS") {
    return {
      title: "Đơn nước không tồn tại",
    };
  }

  const order = orderRes.data[0];
  return {
    title: `${order.title} - Link nước`,
    description: `Đơn nước: ${order.title}`,
  };
}

export default async function OrderPage({ params }: PageProps) {
  const orderRes = await OrderService.getOrderRes(params.orderCode);

  if (orderRes.status !== "SUCCESS") {
    notFound();
  }

  const order = orderRes.data[0];

  // Handle redirect if configured
  if (order.redirect && order.redirectLink !== "") {
    redirect(order.redirectLink);
  }

  return <OrderView order={order} />;
}
