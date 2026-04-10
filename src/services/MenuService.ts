import { API_URL } from "@/src/common/constant";
import { ApiResponse, Menu } from "./types";

const getMenusRes = async (): Promise<ApiResponse<Menu>> => {
  try {
    const menuFetchRes = await fetch(`${API_URL}/menus`);
    return await menuFetchRes.json();
  } catch (err: any) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
};

const getMenuRes = async (menuCode: string): Promise<ApiResponse<Menu>> => {
  try {
    const menuFetchRes = await fetch(`${API_URL}/menus/${menuCode}`);
    return await menuFetchRes.json();
  } catch (err: any) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
};

const MenuService = {
  getMenusRes,
  getMenuRes,
};

export default MenuService;
