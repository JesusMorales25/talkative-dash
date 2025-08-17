// src/utils/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: localStorage.getItem("api_url") || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor para añadir token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
		console.log(token ? JSON.parse(atob(token.split('.')[1])) : 'no token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor para manejar token expirado o inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Puedes guardar la URL actual para redirigir después del login
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
