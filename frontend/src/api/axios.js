import axios from "axios";

const BASE_URL =
  "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev";

const api = axios.create({
  baseURL: BASE_URL,
});

// =========================
// 요청 인터셉터 (Access Token 자동 첨부)
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  console.log("🚀 REQUEST URL:", config.url);
  console.log("🔑 ACCESS TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// 응답 인터셉터 (401 → refresh 처리)
// =========================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access token 만료 처리
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          null,
          {
            params: {
              refresh_token: refreshToken,
            },
          }
        );

        const newAccessToken =
          res.data.access_token;

        console.log("🔄 NEW ACCESS TOKEN:", newAccessToken);

        localStorage.setItem(
          "access_token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log("❌ Refresh 실패 → 로그아웃");

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;