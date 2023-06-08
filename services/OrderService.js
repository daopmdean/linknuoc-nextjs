import { API_URL } from "../common/constant";

export async function getOrderRes(orderCode) {
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
