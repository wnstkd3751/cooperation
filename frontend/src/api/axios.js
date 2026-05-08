import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // access 만료
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refresh_token =
          localStorage.getItem("refresh_token");

        const res = await axios.post(
          "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/auth/refresh",
          null,
          {
            params: {
              refresh_token,
            },
          }
        );

        const newAccessToken =
          res.data.access_token;

        localStorage.setItem(
          "token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return instance(originalRequest);

      } catch (err) {

        localStorage.clear();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;