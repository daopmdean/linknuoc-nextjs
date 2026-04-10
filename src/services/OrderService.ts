import { API_URL } from "@/src/common/constant";
import LoginService from "./LoginService";
import { ApiResponse, Order } from "./types";

const getMyOrderRes = async (size: number): Promise<ApiResponse<Order>> => {
  const token = LoginService.getToken();
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  try {
    const orderFetchRes = await fetch(
      `${API_URL}/orders/mine?size=${size}`,
      requestOptions,
    );
    return await orderFetchRes.json();
  } catch (error: any) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
};

const getOrderRes = async (orderCode: string): Promise<ApiResponse<Order>> => {
  try {
    // Different config for server vs client
    const fetchConfig: RequestInit = {
      headers: {
        "User-Agent": "linknuoc-nextjs/1.0",
        Accept: "application/json",
      },
    };

    // For server-side requests, disable SSL verification in development
    if (
      typeof window === "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      // This is a temporary fix for development SSL issues
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    // Add timeout only if AbortSignal.timeout is available
    if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
      fetchConfig.signal = AbortSignal.timeout(10000);
    }

    const orderFetchRes = await fetch(
      `${API_URL}/orders/${orderCode}`,
      fetchConfig,
    );

    if (!orderFetchRes.ok) {
      throw new Error(
        `HTTP ${orderFetchRes.status}: ${orderFetchRes.statusText}`,
      );
    }

    const data: ApiResponse<Order> = await orderFetchRes.json();
    return data;
  } catch (error: any) {
    // For server-side, return a more graceful fallback
    if (typeof window === "undefined") {
      return {
        status: "ERROR",
        message: `Could not fetch order ${orderCode}: ${error.message}`,
        serverError: true,
      };
    }

    return {
      status: "ERROR",
      message: error.message,
    };
  }
};

const createOrder = async (order: Order): Promise<Order> => {
  const token = LoginService.getToken();
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(order),
  };

  try {
    const orderFetchRes = await fetch(`${API_URL}/orders`, requestOptions);
    const orderRes: ApiResponse<Order> = await orderFetchRes.json();
    if (orderRes.status !== "SUCCESS" || !orderRes.data) {
      throw new Error("Error creating order");
    }

    return orderRes.data[0];
  } catch (err) {
    throw new Error("Error creating order");
  }
};

const OrderService = {
  getMyOrderRes,
  getOrderRes,
  createOrder,
};

export default OrderService;
