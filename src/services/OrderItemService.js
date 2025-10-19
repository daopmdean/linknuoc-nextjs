import { API_URL } from "@/src/common/constant";

const getOrderItems = async (orderCode) => {
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
};

const createOrderItems = async (orderItem) => {
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
    await fetch(`${API_URL}/orders/items`, requestOptions);
  } catch (err) {}
};

const updateOrderItems = async (orderItem) => {
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
    await fetch(`${API_URL}/orders/items/${orderItem.id}`, requestOptions);
  } catch (err) {}
};

const deleteOrderItems = async (id) => {
  const requestOptions = {
    method: "DELETE",
  };

  try {
    await fetch(`${API_URL}/orders/items/${id}`, requestOptions);
  } catch (err) {}
};

const OrderItemService = {
  getOrderItems,
  createOrderItems,
  updateOrderItems,
  deleteOrderItems,
};

export default OrderItemService;
