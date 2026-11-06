import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 관리자 로그인과 데이터 변경 요청에 세션 CSRF 토큰을 자동으로 첨부합니다.
api.interceptors.request.use(async function (config) {
  const method = String(config.method || "get").toLowerCase();
  const needsToken = ["post", "put", "patch", "delete"].includes(method);

  if (needsToken && !config.url.endsWith("/csrf")) {
    const response = await api.get("/csrf");
    config.headers = config.headers || {};
    config.headers["X-CSRF-TOKEN"] = response.data.token;
  }

  return config;
});

export default api;
