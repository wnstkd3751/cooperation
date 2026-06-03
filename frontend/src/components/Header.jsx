// components/Header.jsx

import { useState } from "react";
import ChatBot from "./ChatBot";

export default function Header({
  
  onIngredientClick,
}) {

  const [openAlarm, setOpenAlarm] =
    useState(false);

      const [openChat, setOpenChat] =
    useState(false);


  return (

    <div
      className="
        bg-gradient-to-r
        from-teal-400
        to-teal-500
        text-white
        p-6
        rounded-b-3xl
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
        "
      >

        {/* 프로필 */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

      

          <div>

            <p
              className="
                text-sm
                opacity-80
              "
            >
              안녕하세요,
            </p>

            <p className="font-semibold">
              사용자님
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

        {/* 챗봇 */}
            <button
              onClick={() =>
                setOpenChat(true)
              }
              className="
                text-2xl
              "
            >
              💬
            </button>

        {/* 알림 */}
        <div className="relative">


          {/* 챗봇 모달 */}
      {openChat && (

        <ChatBot
          onClose={() =>
            setOpenChat(false)
          }
        />

      )}

        </div>
        </div>

      </div>

    </div>
  );
}