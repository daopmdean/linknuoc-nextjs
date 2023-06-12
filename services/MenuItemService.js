import { API_URL } from "../common/constant";

export async function getMenuItems(menuCode) {
  try {
    const menuItemFetchRes = await fetch(`${API_URL}/menus/${menuCode}/items`);
    const menuItemRes = await menuItemFetchRes.json();
    return menuItemRes.data;
  } catch (err) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
}
