import { API_URL } from "../common/constant";

const getMenusRes = async () => {
  return {
    status: 'SUCCESS',
    data: [
      {
        id: 1,
        menuName: 'Trà Sữa House',
        menuLink: 'https://trasuahaus.com/menu',
        username: 'alice',
      },
      {
        id: 2,
        menuName: 'Coffee Time',
        menuLink: 'https://coffeetime.com/menu',
        username: 'bob',
      },
      {
        id: 3,
        menuName: 'Juice Bar',
        menuLink: 'https://juicebar.com/menu',
        username: 'carol',
      },
      {
        id: 4,
        menuName: 'Trà Sữa House',
        menuLink: 'https://trasuahaus.com/menu',
        username: 'alice',
      },
      {
        id: 5,
        menuName: 'Coffee Time',
        menuLink: 'https://coffeetime.com/menu',
        username: 'bob',
      },
      {
        id: 6,
        menuName: 'Juice Bar',
        menuLink: 'https://juicebar.com/menu',
        username: 'carol',
      },
      {
        id: 7,
        menuName: 'Trà Sữa House',
        menuLink: 'https://trasuahaus.com/menu',
        username: 'alice',
      },
      {
        id: 8,
        menuName: 'Coffee Time',
        menuLink: 'https://coffeetime.com/menu',
        username: 'bob',
      },
      {
        id: 9,
        menuName: 'Juice Bar',
        menuLink: 'https://juicebar.com/menu',
        username: 'carol',
      },
    ],
  };
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
