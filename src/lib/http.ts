import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      // 🔹 1️⃣ mevcut sayfayı kaydet
      sessionStorage.setItem("postLoginRedirect", window.location.pathname);

      // 🔹 2️⃣ login sayfasında değilse login'e gönder
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
