import axios from "axios";

const api = axios.create({
  baseURL: "https://pedoderma-backend.onrender.com/api",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error?.response?.data || error.message);

    // If server returned 401 Unauthorized, notify the app so auth can be cleared
    const status = error?.response?.status;
    if (status === 401) {
      try {
        const evt = new CustomEvent("unauthorized", { detail: 401 });
        window.dispatchEvent(evt);
      } catch (e) {
        // fallback for older browsers
        window.dispatchEvent(new Event("unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;