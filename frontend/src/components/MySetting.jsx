import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function MySetting() {
  const [userInfo, setUserInfo] = useState(false);
  
  const navigate = useNavigate();
  const handleSave = () => {
    // TODO API 연결
    alert("저장되었습니다.");
    navigate("/setting")
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header onOpenExpire={() => setOpenExpire(true)} />
      
    <div className="pt-[5vh]">
      <h1 className="text-xl font-bold mb-6">
        계정설정
      </h1>

      <div className="bg-white p-5 rounded-xl shadow-sm ">
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

        <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-500">
            요리 레벨
          </label>
          <select name="cooking_level" value={userInfo.cooking_level} 
          onChange={(e) =>
              setUserInfo({
                ...userInfo,
                email: e.target.cooking_level,
              })
            } className="input">
          <option>초보</option>
          <option>중수</option>
          <option>고수</option>
        </select>
        </div>

        <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-500">
            성별
          </label>
          <select name="age_group" value={userInfo.age_group} 
          onChange={(e) =>
              setUserInfo({
                ...userInfo,
                email: e.target.age_group,
              })
            } className="input">
          <option>10대</option>
          <option>20대</option>
          <option>30대</option>
          <option>40대</option>
          <option>50대 이상</option>
        </select>
        </div>

        <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-500">
            성별
          </label>
          <select name="gender" value={userInfo.gender} 
          onChange={(e) =>
              setUserInfo({
                ...userInfo,
                email: e.target.gender,
              })
            } className="input">
          <option>남</option>
          <option>여</option>
        </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-red-400 text-white py-3 rounded-lg"
        >
          저장
        </button>
      </div>
      </div>
    </div>
  );
}