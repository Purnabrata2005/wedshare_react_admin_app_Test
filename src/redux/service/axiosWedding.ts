import axios from "axios";

const AxiosWedding = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL1,
  withCredentials: true, // 🔑 send HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* Optional: response interceptor for global auth errors */
AxiosWedding.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // session expired or not authenticated
      // let route guards handle redirect
      console.warn("Unauthorized – session may have expired");
    }
    return Promise.reject(error);
  }
);

export default AxiosWedding;
