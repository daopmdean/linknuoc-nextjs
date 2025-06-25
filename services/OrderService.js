import { API_URL } from "../common/constant";

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
  // TODO: Replace with actual API call to your authentication endpoint
  // For demonstration purposes, we'll simulate an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (order.title === 'admin') {
        const fakeToken = 'fake-jwt-token-for-demonstration';
        resolve({ token: fakeToken });
      } else {
        reject(new Error('Invalid order or password'));
      }
    }, 1000); // Simulate network delay
  });
};

const OrderService = {
  getOrderRes,
  createOrder,
};

export default OrderService;
