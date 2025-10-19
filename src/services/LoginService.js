import Cookies from "js-cookie";
import { API_URL } from "@/src/common/constant";

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

    return loginRes.data[0];
  } catch (err) {
    throw new Error("Invalid username or password");
  }
};

const register = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const loginFetchRes = await fetch(`${API_URL}/register`, requestOptions);
  const loginRes = await loginFetchRes.json();
  if (loginRes.status === "SUCCESS") {
    return loginRes.data[0];
  }
  if (loginRes.status === "INVALID") {
    if (loginRes.errors?.[0]?.errCode === "ERROR_EMAIL_EXIST") {
      throw new Error("Email already exists");
    } else if (loginRes.errors?.[0]?.errCode === "ERROR_USERNAME_EXIST") {
      throw new Error("Username already exists");
    }
  }

  throw new Error("Registration failed");
};

const logout = () => {
  Cookies.remove("token");
  // a good place to redirect the user to the login page
};

const getToken = () => {
  return Cookies.get("token");
};

const LoginService = {
  login,
  register,
  logout,
  getToken,
};

export default LoginService;
