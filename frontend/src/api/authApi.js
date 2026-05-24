import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (data) => {

  console.log(BASE_URL)

  const res = await axios.post(`${BASE_URL}/auth/login`, data);

  return res.data;
};

export const signup = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/signup`, data);
  return res.data;
};

