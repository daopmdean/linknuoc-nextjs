import { API_URL } from "../common/constant";

export async function getMenusRes() {
  // try {
  //   const menuFetchRes = await fetch(`${API_URL}/menus`);
  //   return await menuFetchRes.json();
  // } catch (err) {
  //   return {
  //     status: "ERROR",
  //     message: err.message,
  //   };
  // }

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
    ],
  };
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
