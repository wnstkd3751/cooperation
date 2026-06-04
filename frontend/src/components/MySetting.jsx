import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getUserInfo,
  updateUserInfo,
} from "../api/authApi";

export default function MySetting() {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    id: "",
    email: "",
    cooking_level: "초보",
    age_group: "20대",
    gender: "남",
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const data = await getUserInfo(
        userId
      );

      console.log(data)

      setUserInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {

      await updateUserInfo(
        userId,
        {
          email: userInfo.email,
          cooking_level:
            userInfo.cooking_level,
          age_group:
            userInfo.age_group,
          gender:
            userInfo.gender,
        }
      );

      alert("저장되었습니다.");

      navigate("/setting");

    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <Header />

      <div className="pt-[5vh]">

        <h1 className="text-xl font-bold mb-6">
          계정설정
        </h1>

        <div className="bg-white p-5 rounded-xl shadow-sm">

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-500">
              아이디
            </label>

            <input
              value={userInfo.id}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-500">
              요리 레벨
            </label>

            <select
              value={userInfo.cooking_level}
              onChange={(e) =>
                setUserInfo({
                  ...userInfo,
                  cooking_level:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            >
              <option>초보</option>
              <option>중수</option>
              <option>고수</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-500">
              연령대
            </label>

            <select
              value={userInfo.age_group}
              onChange={(e) =>
                setUserInfo({
                  ...userInfo,
                  age_group:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            >
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

            <select
              value={userInfo.gender}
              onChange={(e) =>
                setUserInfo({
                  ...userInfo,
                  gender:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            >
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