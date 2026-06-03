import { useState } from "react";

export default function NotificationSetting() {
  const [expireAlert, setExpireAlert] =
    useState(true);

  const [recipeAlert, setRecipeAlert] =
    useState(true);

  const saveSetting = () => {
    // TODO API 연결
    alert("알림 설정 저장 완료");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-6">
        알림 설정
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-5">

        <div className="flex justify-between items-center py-4 border-b">
          <span>유통기한 알림</span>

          <input
            type="checkbox"
            checked={expireAlert}
            onChange={() =>
              setExpireAlert(!expireAlert)
            }
          />
        </div>

        <div className="flex justify-between items-center py-4">
          <span>레시피 추천 알림</span>

          <input
            type="checkbox"
            checked={recipeAlert}
            onChange={() =>
              setRecipeAlert(!recipeAlert)
            }
          />
        </div>

        <button
          onClick={saveSetting}
          className="w-full mt-6 bg-red-400 text-white py-3 rounded-lg"
        >
          저장
        </button>

      </div>
    </div>
  );
}