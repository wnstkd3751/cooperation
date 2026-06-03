import { useState } from "react";
import Header from "../components/Header";
import ExpireModal from "../components/ExpireModal";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Setting() {

  const [openExpire, setOpenExpire] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/login");
    }
  };

  const handleWithdraw = () => {
    if (
      window.confirm(
        "정말 회원탈퇴 하시겠습니까?\n모든 데이터가 삭제됩니다."
      )
    ) {
      // TODO: 회원탈퇴 API 호출
    }
  };
  
  return (
    <div>
          <Header onOpenExpire={() => setOpenExpire(true)} />
    <div className="p-6 pb-24">

      {/* 프로필 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-300 rounded-full" />
        <div>
          <p className="font-semibold">{userId}</p>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="space-y-3">

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <button
  onClick={() => {
    navigate("/setting/my");
  }}
>계정설정</button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <button
  onClick={() => {
    avigate("/setting/")
  }}
>알림설정</button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <button
  onClick={() => {
    navigate("/setting/privacy")
  }}
>개인정보 처리방침</button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm text-red-400">
          <button
  onClick={() => {
    handleLogout()
  }}
>
  로그아웃
</button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm text-red-400">
          <button
  onClick={() => {
    handleWithdraw()
  }}
>
  회원탈퇴
</button>
        </div>

      </div>

    </div>
    {openExpire && (
                <ExpireModal items={items} onClose={() => setOpenExpire(false)} />
              )}
    </div>
  );
}