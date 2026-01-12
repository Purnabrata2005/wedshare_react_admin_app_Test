import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔑 send HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* Optional: global response handler */
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – session expired or not logged in");
      // Do NOT redirect here — let route guards handle it
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
