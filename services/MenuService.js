import { API_URL } from "../common/constant";

export async function getMenusRes() {
  const menuFetchRes = await fetch(`${API_URL}/menus`);
  return await menuFetchRes.json();
}

export async function getMenuRes(menuCode) {
  const menuFetchRes = await fetch(`${API_URL}/menus/${menuCode}`);
  return await menuFetchRes.json();
}
