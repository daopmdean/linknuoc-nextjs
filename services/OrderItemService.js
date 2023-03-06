import { API_URL } from "../common/constant";

export async function getOrderItems(orderCode) {
  const orderItemFetchRes = await fetch(`${API_URL}/orders/${orderCode}/items`);
  const orderItemRes = await orderItemFetchRes.json();
  return orderItemRes.data;
}

export async function createOrderItems(orderItem) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderCode: orderItem.orderCode,
      name: orderItem.name,
      drink: orderItem.drink,
      size: orderItem.size,
    }),
  };

  await fetch(`${API_URL}/items`, requestOptions);
}

export async function updateOrderItems(orderItem) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderCode: orderItem.orderCode,
      name: orderItem.name,
      drink: orderItem.drink,
      size: orderItem.size,
    }),
  };

  await fetch(`${API_URL}/items/${orderItem.id}`, requestOptions);
}

export async function deleteOrderItems(id) {
  const requestOptions = {
    method: "DELETE",
  };
  await fetch(`${API_URL}/items/${id}`, requestOptions);
}
