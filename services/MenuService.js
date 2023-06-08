import { API_URL } from "../common/constant";

export async function getMenusRes() {
  try {
    const menuFetchRes = await fetch(`${API_URL}/menus`);
    return await menuFetchRes.json();
  } catch (err) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
}

export async function getMenuRes(menuCode) {
  try {
    const menuFetchRes = await fetch(`${API_URL}/menus/${menuCode}`);
    return await menuFetchRes.json();
  } catch (err) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
}
