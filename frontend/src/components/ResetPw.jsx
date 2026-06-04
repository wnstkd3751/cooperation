import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendCode,
  verifyCode,
  changePassword,
} from "../api/authApi";

export default function PasswordChange() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [verified, setVerified] =
    useState(false);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const handleSendCode = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      await sendCode(email);

      alert(
        "인증번호를 발송했습니다."
      );

    } catch (e) {
      console.error(e);

      alert(
        "인증번호 발송 실패"
      );
    }
  };

  const handleVerifyCode =
    async () => {

      try {

        await verifyCode(
          email,
          code
        );

        setVerified(true);

        alert(
          "이메일 인증 완료"
        );

      } catch (e) {

        console.error(e);

        alert("인증 실패");

      }
    };

  const handleChangePassword =
    async () => {

      if (
        newPassword !==
        confirmPassword
      ) {

        alert(
          "비밀번호가 일치하지 않습니다."
        );

        return;
      }

      try {

        await changePassword(
          email,
          newPassword
        );

        alert(
          "비밀번호가 변경되었습니다."
        );

        navigate("/login");

      } catch (e) {

        console.error(e);

        alert(
          "비밀번호 변경 실패"
        );

      }
    };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="w-full min-h-screen bg-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          비밀번호 변경
        </h1>

        {/* 이메일 */}
        <div className="mb-4">

          <label className="block text-sm text-gray-500 mb-2">
            이메일
          </label>

          <div className="flex gap-2">

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="flex-1 border rounded-lg p-3"
              placeholder="이메일 입력"
            />

            <button
              onClick={handleSendCode}
              className="bg-red-400 text-white px-4 rounded-lg"
            >
              발송
            </button>

          </div>

          {/* 인증번호 */}
          <div className="mt-4 mb-6">

            <label className="block text-sm text-gray-500 mb-2">
              인증번호
            </label>

            <div className="flex gap-2">

              <input
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                  )
                }
                className="flex-1 border rounded-lg p-3"
                placeholder="인증번호 입력"
              />

              <button
                onClick={
                  handleVerifyCode
                }
                className="bg-blue-500 text-white px-4 rounded-lg"
              >
                확인
              </button>

            </div>

          </div>

          {verified && (
            <>
              <div className="mb-4">

                <label className="block text-sm text-gray-500 mb-2">
                  새 비밀번호
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div className="mb-6">

                <label className="block text-sm text-gray-500 mb-2">
                  새 비밀번호 확인
                </label>

                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <button
                onClick={
                  handleChangePassword
                }
                className="w-full bg-red-400 text-white py-3 rounded-lg"
              >
                비밀번호 변경
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}