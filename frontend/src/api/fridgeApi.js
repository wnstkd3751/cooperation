// src/api/fridgeApi.js

import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL;

// =========================
// axios 인스턴스
// =========================
const api = axios.create({
  baseURL: BASE_URL,
});

// =========================
// access token 자동 첨부
// =========================
api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    console.log(
      "TOKEN:",
      token
    );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  }
);

// =========================
// 재료 추가
// =========================
export const addFridgeItem =
  async (data) => {

    const res =
      await api.post(
        "/fridge/",
        data
      );

    return res.data;
  };

// =========================
// 냉장고 재료 조회
// =========================
export const getFridgeItems =
  async (userId) => {

    console.log(
      "📦 getFridgeItems userId:",
      userId
    );

    const res =
      await api.get(
        "/fridge/",
        {
          params: {
            user_id: userId,
          },
        }
      );

    console.log(
      "📦 getFridgeItems response:",
      res
    );

    return res.data;
  };

// =========================
// 재료 삭제
// =========================
export const deleteFridgeItem =
  async (itemId) => {

    const res =
      await api.delete(
        `/fridge/${itemId}`
      );

    return res.data;
  };

// =========================
// 재료 수정
// =========================
export const updateFridgeItem =
  async (
    itemId,
    data
  ) => {

    const res =
      await api.put(
        `/fridge/${itemId}`,
        data
      );

    return res.data;
  };

// =========================
// 유통기한 임박 재료 조회
// =========================
export const getExpiringFoods =
  async () => {

    const res =
      await api.get(
        "/fridge/expiring"
      );

    return res.data;
  };

// =========================
// export
// =========================
export default api;