import { API_URL } from "@/src/common/constant";

const getOrderItems = async (orderCode) => {
  try {
    const orderItemFetchRes = await fetch(
      `${API_URL}/orders/${orderCode}/items`
    );
    const orderItemRes = await orderItemFetchRes.json();
    
    // Ensure we always return an array
    if (orderItemRes.status === "SUCCESS") {
      return Array.isArray(orderItemRes.data) ? orderItemRes.data : [];
    } else {
      console.warn("Failed to fetch order items:", orderItemRes);
      return [];
    }
  } catch (error) {
    console.error("Error in getOrderItems:", error);
    return []; // Return empty array instead of error object
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
    const fetchResponse = await fetch(`${API_URL}/orders/items`, requestOptions);
    const response = await fetchResponse.json();
    if (response.status !== "SUCCESS") {
      throw new Error("createOrderItems failed " + response.status);
    }

    // Return the new item data for the caller to handle socket events
    return response.data;

  } catch (err) {
    throw new Error("createOrderItems with error: " + err.message);
  }
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
    const fetchResponse = await fetch(`${API_URL}/orders/items/${orderItem.id}`, requestOptions);
    const response = await fetchResponse.json();
    if (response.status !== "SUCCESS") {
      throw new Error("updateOrderItems failed " + response.status);
    }

    // Return the updated item data for the caller to handle socket events
    return response.data;
    
  } catch (err) {
    throw new Error("updateOrderItems with error: " + err.message);
  }
};

const deleteOrderItems = async (id, orderCode) => {
  const requestOptions = {
    method: "DELETE",
  };

  try {
    await fetch(`${API_URL}/orders/items/${id}`, requestOptions);
    return true; // Success
  } catch (err) {
    return false; // Error
  }
};

const OrderItemService = {
  getOrderItems,
  createOrderItems,
  updateOrderItems,
  deleteOrderItems,
};

export default OrderItemService;
