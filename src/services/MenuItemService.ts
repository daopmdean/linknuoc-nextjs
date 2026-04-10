import { API_URL } from "@/src/common/constant";
import { ApiResponse, MenuItem } from "./types";

const getMenuItems = async (
  menuCode: string,
): Promise<MenuItem[] | ApiResponse> => {
  try {
    const menuItemFetchRes = await fetch(`${API_URL}/menus/${menuCode}/items`);
    const menuItemRes: ApiResponse<MenuItem> = await menuItemFetchRes.json();
    return menuItemRes.data || [];
  } catch (err: any) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
};

const MenuItemService = {
  getMenuItems,
};

export default MenuItemService;
