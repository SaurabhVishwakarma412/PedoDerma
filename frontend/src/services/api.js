import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR =================
   Automatically attach JWT token to every request
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR =================
   Clear error logging (optional but useful)
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API ERROR:",
      error?.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;
