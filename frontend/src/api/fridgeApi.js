import axios from "axios";

const BASE_URL = "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev";

// 🔥 재료 추가
export const addFridgeItem = async (data) => {
  const res = await axios.post(`${BASE_URL}/fridge/`, data);
  return res.data;
};

// 🔥 재료 조회
export const getFridgeItems = async (user_id) => {
  const res = await axios.get(`${BASE_URL}/fridge`, {
    params: { user_id },
  });
  return res.data;
};