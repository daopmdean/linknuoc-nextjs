import axios from "axios";
import { API_URL } from "../common/constant";

export async function getOrderItems(orderCode) {
  const orderItemRes = await axios.get(`${API_URL}/orders/${orderCode}/items`);
  return orderItemRes.data.data;
}

export async function createOrderItems(orderItem) {
  const orderItemRes = await axios.post(`${API_URL}/items`, {
    order_code: orderItem.order_code,
    name: orderItem.name,
    drink: orderItem.drink,
    size: orderItem.size,
  });

  // const requestOptions = {
  //   method: "POST",
  //   body: JSON.stringify({
  //     order_code: orderItem.order_code,
  //     name: orderItem.name,
  //     drink: orderItem.drink,
  //     size: orderItem.size,
  //   }),
  // };

  // await fetch(`${API_URL}/items`, requestOptions)
  //   .then((res) => res.json())
  //   .then((data) => {});
  // console.log(requestOptions);
}

export async function updateOrderItems(orderItem) {
  const orderItemRes = await axios.put(`${API_URL}/items/${orderItem.id}`, {
    order_code: orderItem.order_code,
    name: orderItem.name,
    drink: orderItem.drink,
    size: orderItem.size,
  });
}

export async function deleteOrderItems(id) {
  const orderItemRes = await axios.delete(`${API_URL}/items/${id}`);
}
