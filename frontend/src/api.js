import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// 관리자 로그인과 데이터 변경 요청에 세션 CSRF 토큰을 자동으로 첨부합니다.
api.interceptors.request.use(async function (config) {
  const method = String(config.method || "get").toLowerCase();
  const needsToken = ["post", "put", "patch", "delete"].includes(method);
  const requestUrl = String(config.url || "");

  if (needsToken && !requestUrl.endsWith("/csrf")) {
    const response = await api.get("/csrf", {
      timeout: 10000,
      signal: config.signal
    });
    config.headers = config.headers || {};
    config.headers["X-CSRF-TOKEN"] = response.data.token;
  }

  return config;
});

export default api;
