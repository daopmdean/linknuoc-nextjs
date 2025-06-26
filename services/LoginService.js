import Cookies from 'js-cookie';
import { API_URL } from "../common/constant";

const login = async (username, password) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };

  try {
    const loginFetchRes = await fetch(`${API_URL}/login`, requestOptions);
    const loginRes = await loginFetchRes.json();
    if (loginRes.status !== "SUCCESS") {
      throw new Error("Invalid username or password");
    }

    return loginRes.data[0]
  } catch (err) {
    throw new Error("Invalid username or password");
  }
};

const logout = () => {
  Cookies.remove('token');
  // a good place to redirect the user to the login page
};

const getToken = () => {
  return Cookies.get('token');
};

const LoginService = {
  login,
  logout,
  getToken,
};

export default LoginService;
