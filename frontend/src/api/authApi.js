import axios from "axios";

const BASE_URL = "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev";

export const login = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });
  return res.data;
};

export const signup = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/signup`, {
    email,
    password,
  });
  return res.data;
};
