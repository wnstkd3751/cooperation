import { useState } from "react";
import { signup, sendCode, verifyCode, checkEmail } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Signup() {
  const [form, setForm] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    email: "",
    age: "",
    cooking_level: "초보",
    gender: "남",
  });

  const [idStatus, setIdStatus] = useState(null); // null | "ok" | "fail"
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAiTransfer, setAgreeAiTransfer] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "id") setIdStatus(null);
  };

  // 아이디 중복확인
  const handleCheckId = async () => {
    if (!form.id) return;
    try {
      await axios.post(`${BASE_URL}/auth/check-id`, { id: form.id });
      setIdStatus("ok");
    } catch {
      setIdStatus("fail");
    }
  };

  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateForm = () => {

  if (!form.id.trim()) {
    return "아이디를 입력해주세요.";
  }

  if (form.id.length < 4) {
    return "아이디는 4자 이상 입력해주세요.";
  }

  if (!isValidEmail(form.email)) {
    return "이메일 형식이 올바르지 않습니다.";
  }

  if (!emailVerified) {
    return "이메일 인증을 완료해주세요.";
  }

  if (form.password.length < 8) {
    return "비밀번호는 8자 이상 입력해주세요.";
  }

  if (!/[A-Za-z]/.test(form.password)) {
    return "비밀번호에 영문을 포함해주세요.";
  }

  if (!/\d/.test(form.password)) {
    return "비밀번호에 숫자를 포함해주세요.";
  }

  if (!isPasswordMatch) {
    return "비밀번호가 일치하지 않습니다.";
  }

  if (!isAgeValid) {
    return "만 14세 이상만 가입 가능합니다.";
  }

  if (!agreePrivacy) {
    return "개인정보처리방침에 동의해주세요.";
  }

  if (!agreeAiTransfer) {
    return "AI 정보 전송에 동의해주세요.";
  }

  return null;
};

  // 이메일 인증코드 발송
  const handleSendCode = async () => {

  if (!form.email) {
    alert("이메일을 입력해주세요.");
    return;
  }

  if (!isValidEmail(form.email)) {
    alert("올바른 이메일 형식이 아닙니다.");
    return;
  }

  try {

    console.log("checkEmail")

    // 이메일 중복 확인
    await checkEmail(form.email);

    console.log("sendCode")
    // 인증번호 발송
    await sendCode(form.email);

    setCodeSent(true);

    alert("인증번호가 발송되었습니다.");

  } catch (e) {


    alert(
      "인증번호 발송 실패"
    );

  }

};

  // 이메일 인증코드 확인
  const handleVerifyCode = async () => {
    try {
      await verifyCode(form.email, emailCode);
      setEmailVerified(true);
      alert("이메일 인증 완료");
    } catch {
      alert("인증번호가 올바르지 않습니다");
    }
  };

  const isAgeValid = form.age !== "" && Number(form.age) >= 14;
  const isPasswordMatch = form.password === form.passwordConfirm && form.password !== "";

  const canSubmit =
    form.id !== "" &&
    form.email !== "" &&
    form.password !== "" &&
    form.age !== "" &&
    idStatus === "ok" &&
    emailVerified &&
    isAgeValid &&
    isPasswordMatch &&
    agreePrivacy &&
    agreeAiTransfer;

  const handleSignup = async () => {

  const error = validateForm();

  if (error) {
    alert(error);
    return;
  }

  try {

    await signup({
      id: form.id,
      password: form.password,
      email: form.email,
      age: Number(form.age),
      cooking_level: form.cooking_level,
      gender: form.gender,
      consents: {
        privacy_policy: agreePrivacy,
        ai_transfer: agreeAiTransfer,
      },
    });

    alert("회원가입 성공");
    navigate("/login");

  } catch (e) {

    alert(
      e?.response?.data?.detail ??
      "회원가입 실패"
    );

  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        {/* 아이디 */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 mb-1 block">아이디</label>
          <div className="flex gap-2">
            <input
              name="id"
              placeholder="아이디"
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button
              onClick={handleCheckId}
              className="px-3 py-2 bg-gray-100 text-sm rounded-lg border border-gray-300 hover:bg-gray-200 whitespace-nowrap"
            >
              중복확인
            </button>
          </div>
          {idStatus === "ok" && <p className="text-green-500 text-xs mt-1">사용 가능한 아이디입니다</p>}
          {idStatus === "fail" && <p className="text-red-500 text-xs mt-1">이미 사용 중인 아이디입니다</p>}
        </div>

        {/* 이메일 */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 mb-1 block">이메일</label>
          <div className="flex gap-2">
            <input
              name="email"
              placeholder="이메일"
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button
              onClick={handleSendCode}
              className="px-3 py-2 bg-gray-100 text-sm rounded-lg border border-gray-300 hover:bg-gray-200 whitespace-nowrap"
            >
              인증발송
            </button>
          </div>
          {codeSent && (
            <div className="flex gap-2 mt-2">
              <input
                placeholder="인증번호 입력"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <button
                onClick={handleVerifyCode}
                className="px-3 py-2 bg-gray-100 text-sm rounded-lg border border-gray-300 hover:bg-gray-200 whitespace-nowrap"
              >
                확인
              </button>
            </div>
          )}
          {emailVerified && <p className="text-green-500 text-xs mt-1">이메일 인증 완료</p>}
        </div>

        {/* 비밀번호 */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 mb-1 block">비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 mb-1 block">비밀번호 확인</label>
          <input
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          {form.passwordConfirm && !isPasswordMatch && (
            <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다</p>
          )}
          {form.passwordConfirm && isPasswordMatch && (
            <p className="text-green-500 text-xs mt-1">비밀번호가 일치합니다</p>
          )}
        </div>

        {/* 나이 */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 mb-1 block">나이</label>
          <input
            name="age"
            type="number"
            placeholder="나이"
            value={form.age}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          {form.age !== "" && Number(form.age) < 14 && (
            <p className="text-red-500 text-xs mt-1">만 14세 미만은 가입할 수 없습니다</p>
          )}
        </div>

        {/* 성별 */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 mb-1 block">성별</label>
          <select
            name="gender"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option>남</option>
            <option>여</option>
          </select>
        </div>

        {/* 요리 레벨 */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">요리 레벨</label>
          <select
            name="cooking_level"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option>초보</option>
            <option>중급</option>
            <option>고수</option>
          </select>
        </div>

        {/* 동의 */}
        <div className="space-y-2 border-t pt-3 mb-4">
          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              (필수){" "}
              <Link to="/privacy-policy" className="text-blue-500 underline" target="_blank">
                개인정보처리방침
              </Link>
              에 동의합니다.
            </span>
          </label>

          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={agreeAiTransfer}
              onChange={(e) => setAgreeAiTransfer(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              (필수) AI 챗봇 및 영수증/재료 사진 인식을 위해 입력 내용 및
              사진 정보가 미국 Anthropic, OpenAI로 전송되는 것에 동의합니다.
            </span>
          </label>
        </div>

        {/* 가입 버튼 */}
        <button
          onClick={handleSignup}
          disabled={!canSubmit}
          className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${
            canSubmit ? "bg-red-400 hover:bg-red-500" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}