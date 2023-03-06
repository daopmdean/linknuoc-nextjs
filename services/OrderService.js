import { API_URL } from "../common/constant";

export async function getOrderRes(orderCode) {
  const orderFetchRes = await fetch(`${API_URL}/orders/${orderCode}`);
  return await orderFetchRes.json();
}
