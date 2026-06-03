import { useState } from "react";

export default function MySetting() {
  const [userInfo, setUserInfo] = useState({
    id: "junsang",
    email: "user@email.com",
  });

  const handleSave = () => {
    // TODO API 연결
    alert("저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-6">
        계정 설정
      </h1>

      <div className="bg-white p-5 rounded-xl shadow-sm">
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">
            아이디
          </label>

          <input
            value={userInfo.id}
            onChange={(e) =>
              setUserInfo({
                ...userInfo,
                id: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-500">
            이메일
          </label>

          <input
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({
                ...userInfo,
                email: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-red-400 text-white py-3 rounded-lg"
        >
          저장
        </button>
      </div>
    </div>
  );
}