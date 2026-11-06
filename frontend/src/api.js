import axios from "axios";

// 로컬과 배포 환경에서 같은 API 경로를 사용합니다.
// VITE_API_URL을 지정하면 별도 API 서버 주소도 사용할 수 있습니다.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
