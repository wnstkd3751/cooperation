import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {

    const res = await login({
  id,
  password,
});


console.log("로그인 성공, 응답 데이터:", res);

const { login: setAuth } = useAuthStore.getState();

setAuth(
  res.access_token,
  res.refresh_token,
  res.user_id
);

    localStorage.setItem(
      "refresh_token",
      res.refresh_token
    );

    
    alert("로그인 성공");
    navigate("/");
  } catch (e) {
    console.error(e);
    alert("로그인 실패");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* 카드 */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-center mb-6">
          🧊 로그인
        </h1>

        {/* 아이디 */}
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg"
        />

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full bg-red-400 text-white py-3 rounded-lg font-semibold hover:bg-red-500"
        >
          로그인
        </button>

        {/* 회원가입 이동 */}
        <p className="text-center text-sm mt-4 text-gray-500">
          계정이 없으신가요?
          <span
  onClick={() => navigate("/signup")}
  className="text-red-400 ml-1 cursor-pointer"
>
  회원가입
</span>
        </p>

      </div>
    </div>
  );
}