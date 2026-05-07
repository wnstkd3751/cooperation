import axios from "axios";

const BASE_URL = "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev";

export const login = async (data) => {

  const res = await axios.post(`${BASE_URL}/auth/login`, data);

  return res.data;
};

export const signup = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/signup`, data);
  return res.data;
};

