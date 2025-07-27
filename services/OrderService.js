import { API_URL } from "../common/constant";
import LoginService from "./LoginService";

const getMyOrderRes = async (size) => {
  const token = LoginService.getToken();
  const requestOptions = {
    method: "GET",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  };

  try {
    const orderFetchRes = await fetch(`${API_URL}/orders/mine?size=${size}`, requestOptions);
    return await orderFetchRes.json();
  } catch (error) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
}

const getOrderRes = async (orderCode) => {
  try {
    const orderFetchRes = await fetch(`${API_URL}/orders/${orderCode}`);
    return await orderFetchRes.json();
  } catch (error) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
}

const createOrder = async (order) => {
  const token = LoginService.getToken();
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(order),
  };

  try {
    const orderFetchRes = await fetch(`${API_URL}/orders`, requestOptions);
    const orderRes = await orderFetchRes.json();
    if (orderRes.status !== "SUCCESS") {
      throw new Error("Error creating order");
    }
    console.log("orderRes", orderRes.data[0]);

    return orderRes.data[0]
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
