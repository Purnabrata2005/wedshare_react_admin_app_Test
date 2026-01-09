import axios from "axios";


const AxiosGoogle = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL2,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach token
AxiosGoogle.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default AxiosGoogle;
