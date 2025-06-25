import Cookies from 'js-cookie';

const login = async (username, password) => {
  // TODO: Replace with actual API call to your authentication endpoint
  // For demonstration purposes, we'll simulate an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        const fakeToken = 'fake-jwt-token-for-demonstration';
        resolve({ token: fakeToken });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 1000); // Simulate network delay
  });
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