import { API_URL } from "@/src/common/constant";

const getMenusRes = async () => {
  try {
    const menuFetchRes = await fetch(`${API_URL}/menus`);
    return await menuFetchRes.json();
  } catch (err) {
    return {
      status: "ERROR",
      message: err.message,
    };
  }
};

const getMenuRes = async (menuCode) => {
  try {
    const menuFetchRes = await fetch(`${API_URL}/menus/${menuCode}`);
    return await menuFetchRes.json();
  } catch (err) {
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
