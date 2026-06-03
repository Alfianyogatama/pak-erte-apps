import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5001") + "/api",
});
// Otomatis menyisipkan token JWT ke setiap request
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
  },
);

api.interceptors.response.use(
  (response) => response, // Jika sukses, lanjutkan
  (error) => {
    // Jika server merespons 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // 1. Hapus token dari storage
      localStorage.removeItem("token");

      // 2. Arahkan user ke halaman login
      window.location.href = "/login";

      // 3. Opsional: Beri notifikasi
      alert("Sesi Anda telah berakhir, silakan login kembali.");
    }
    return Promise.reject(error);
  },
);

export default api;
