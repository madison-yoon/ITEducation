import axios from "axios";
// 모든 API 요청에서 세션 쿠키를 함께 전송합니다.
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||"http://localhost:8080/api",withCredentials:true,headers:{"Content-Type":"application/json"}});
export default api;