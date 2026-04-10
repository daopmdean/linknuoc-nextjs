import { notFound, redirect } from "next/navigation";
import OrderView from "./OrderView";
import OrderService from "@/src/services/OrderService";

interface PageProps {
  params: {
    orderCode: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const orderRes = await OrderService.getOrderRes(params.orderCode);

    if (
      orderRes.status !== "SUCCESS" ||
      orderRes.serverError ||
      !orderRes.data ||
      !orderRes.data[0]
    ) {
      return {
        title: "Đơn nước không tồn tại",
        description: "Không thể tải thông tin đơn nước",
      };
    }

    const order = orderRes.data[0];
    return {
      title: `${order.title} - Link nước`,
      description: `Đơn nước: ${order.title}`,
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return {
      title: "Đơn nước không tồn tại",
      description: "Lỗi khi tải thông tin đơn nước",
    };
  }
}

export default async function OrderPage({ params }: PageProps) {
  try {
    const orderRes = await OrderService.getOrderRes(params.orderCode);
    console.log("OrderPage - API Response:", orderRes);

    if (
      orderRes.status !== "SUCCESS" ||
      orderRes.serverError ||
      !orderRes.data ||
      !orderRes.data[0]
    ) {
      console.log("Order not found or server error:", orderRes);
      notFound();
    }

    const order = orderRes.data[0];

    // Handle redirect if configured
    if (order.redirect && order.redirectLink) {
      redirect(order.redirectLink as string);
    }

    return <OrderView order={order as any} />;
  } catch (error) {
    console.error("OrderPage error:", error);
    notFound();
  }
}
