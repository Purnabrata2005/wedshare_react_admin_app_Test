import axios from "axios";

const AxiosWedding = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL1 ,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  },
});

// Auto add token from localStorage
AxiosWedding.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default AxiosWedding;
