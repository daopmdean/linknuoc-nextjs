import { API_URL } from "@/src/common/constant";
import LoginService from "./LoginService";

const getMyOrderRes = async (size) => {
  const token = LoginService.getToken();
  const requestOptions = {
    method: "GET",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  };

  try {
    const orderFetchRes = await fetch(`${API_URL}/orders/mine?size=${size}`, requestOptions);
    return await orderFetchRes.json();
  } catch (error) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
}

const getOrderRes = async (orderCode) => {
  try {
    console.log(`Fetching URL: ${API_URL}/orders/${orderCode}`);
    console.log(`Environment: ${typeof window !== 'undefined' ? 'client' : 'server'}`);
    
    // Different config for server vs client
    const fetchConfig = {
      headers: {
        'User-Agent': 'linknuoc-nextjs/1.0',
        'Accept': 'application/json',
      },
    };
    
    // For server-side requests, disable SSL verification in development
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
      // This is a temporary fix for development SSL issues
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    
    // Add timeout only if AbortSignal.timeout is available
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      fetchConfig.signal = AbortSignal.timeout(10000);
    }
    
    const orderFetchRes = await fetch(`${API_URL}/orders/${orderCode}`, fetchConfig);
    
    console.log(`Response status: ${orderFetchRes.status}`);
    
    if (!orderFetchRes.ok) {
      throw new Error(`HTTP ${orderFetchRes.status}: ${orderFetchRes.statusText}`);
    }
    
    const data = await orderFetchRes.json();
    console.log(`Response data:`, data);
    return data;
  } catch (error) {
    console.error(`getOrderRes error for ${orderCode}:`, error);
    
    // For server-side, return a more graceful fallback
    if (typeof window === 'undefined') {
      console.log('Server-side fetch failed, returning fallback response');
      return {
        status: "ERROR", 
        message: `Could not fetch order ${orderCode}: ${error.message}`,
        serverError: true,
      };
    }
    
    return {
      status: "ERROR",
      message: error.message,
    };
  }
}

const createOrder = async (order) => {
  const token = LoginService.getToken();
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(order),
  };

  try {
    const orderFetchRes = await fetch(`${API_URL}/orders`, requestOptions);
    const orderRes = await orderFetchRes.json();
    if (orderRes.status !== "SUCCESS") {
      throw new Error("Error creating order");
    }
    console.log("orderRes", orderRes.data[0]);

    return orderRes.data[0]
  } catch (err) {
    throw new Error("Error creating order");
  }
};

const OrderService = {
  getMyOrderRes,
  getOrderRes,
  createOrder,
};

export default OrderService;
