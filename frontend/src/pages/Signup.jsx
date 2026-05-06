import { useState } from "react";
import { signup } from "../api/authApi";

export default function Signup() {
  const [form, setForm] = useState({
    id: "",
    password: "",
    email: "",
    cooking_level: "초보",
    age_group: "20대",
    gender: "남"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      await signup(form);
      alert("회원가입 성공");
    } catch (e) {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-xl font-bold mb-4">회원가입</h1>

        <input name="id" placeholder="아이디" onChange={handleChange} className="input" />
        <input name="email" placeholder="이메일" onChange={handleChange} className="input" />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} className="input" />

        <select name="cooking_level" onChange={handleChange} className="input">
          <option>초보</option>
          <option>중급</option>
          <option>고수</option>
        </select>

        <select name="age_group" onChange={handleChange} className="input">
          <option>10대</option>
          <option>20대</option>
          <option>30대</option>
        </select>

        <select name="gender" onChange={handleChange} className="input">
          <option>남</option>
          <option>여</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full mt-4 bg-red-400 text-white py-2 rounded"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}