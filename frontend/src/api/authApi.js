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




export const deleteAccount = async (userId) => {

  const token =
      localStorage.getItem(
        "access_token"
      );

  console.log(token)
  const res = await axios.post(
  `${BASE_URL}/auth/deleteAccount`,
  { user_id: userId },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
  return res.data;
};

export const getUserInfo = async (userId) => {
  const res = await axios.get(
    `${BASE_URL}/auth/${userId}`
  );

  return res.data;
};

export const updateUserInfo = async (
  userId,
  userInfo
) => {
  const res = await axios.put(
    `${BASE_URL}/auth/${userId}`,
    userInfo
  );

  return res.data;
};

export const checkEmail = async (email) => {
  const res = await axios.post(
    `${BASE_URL}/auth/check-email`,
    { email }
  );

  return res.data;
};

export const sendCode = async (
  email
) => {
  const res = await axios.post(
    `${BASE_URL}/auth/send-code`,
    { email }
  );

  return res.data;
};

export const verifyCode = async (
  email,
  code
) => {
  const res = await axios.post(
    `${BASE_URL}/auth/verify-code`,
    {
      email,
      code,
    }
  );

  return res.data;
};

export const changePassword =
  async (email, password) => {

    const res =
      await axios.post(
        `${BASE_URL}/auth/change-password`,
        {
          email,
          password,
        }
      );

    return res.data;
};