import axios from "./axios";

const BASE_URL =
  "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev";

// axios 인스턴스
const api = axios.create({
  baseURL: BASE_URL,
});

// 요청마다 토큰 자동 첨부
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 재료 추가
export const addFridgeItem = async (data) => {
  const res = await api.post("/fridge/", data);
  return res.data;
};

// 재료 조회
export const getFridgeItems = async (user_id) => {
  const res = await api.get("/fridge/", {
    params: { user_id },
  });

  return res.data;
};