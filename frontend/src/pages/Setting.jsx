import { useState } from "react";
import Header from "../components/Header";
import ExpireModal from "../components/ExpireModal";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Setting() {

  const [openExpire, setOpenExpire] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  
  return (
    <div>
          <Header onOpenExpire={() => setOpenExpire(true)} />
    <div className="p-6 pb-24">

      {/* 프로필 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-300 rounded-full" />
        <div>
          <p className="font-semibold">사용자님</p>
          <p className="text-sm text-gray-400">user@email.com</p>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="space-y-3">

        <div className="bg-white p-4 rounded-xl shadow-sm">
          계정 설정
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          알림 설정
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          이용약관
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm text-red-400">
          <button
  onClick={() => {
    logout();
    navigate("/login");
  }}
>
  로그아웃
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