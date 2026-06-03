import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Instance terpisah khusus untuk API Jadwal Shalat (karena base URL beda)
export const apiShalat = axios.create({
  baseURL: "https://equran.id/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
