import { create } from "zustand";

export const useAuthStore = create((set) => ({

  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  userId: localStorage.getItem("user_id"),

  login: (accessToken, refreshToken, userId) => {

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_id", userId);

    set({
      accessToken,
      refreshToken,
      userId,
    });
  },

  logout: () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");

    set({
      accessToken: null,
      refreshToken: null,
      userId: null,
    });
  },

}));