import { API_URL } from "../common/constant";

export async function getOrderItems(orderCode) {
  try {
    const orderItemFetchRes = await fetch(
      `${API_URL}/orders/${orderCode}/items`
    );
    const orderItemRes = await orderItemFetchRes.json();
    return orderItemRes.data;
  } catch (error) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
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

  try {
    await fetch(`${API_URL}/items`, requestOptions);
  } catch (err) {}
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

  try {
    await fetch(`${API_URL}/items/${orderItem.id}`, requestOptions);
  } catch (err) {}
}

export async function deleteOrderItems(id) {
  const requestOptions = {
    method: "DELETE",
  };

  try {
    await fetch(`${API_URL}/items/${id}`, requestOptions);
  } catch (err) {}
}
