// components/Header.jsx

import { useState } from "react";

export default function Header({
  
  onIngredientClick,
}) {

  const [openAlarm, setOpenAlarm] =
    useState(false);


    const ei = [
  {
    name: "당근",
    dday: 1,
  },
  {
    name: "양파",
    dday: 2,
  },
  {
    name: "두부",
    dday: 1,
  },
];
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

          <img
            src="/img/profile.png"
            className="
              w-10
              h-10
              rounded-full
            "
          />

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

        {/* 알림 */}
        <div className="relative">

          <div
            className="
              relative
              cursor-pointer
              text-2xl
            "
            onClick={() =>
              setOpenAlarm(
                !openAlarm
              )
            }
          >

            🔔

            {ei.length >
              0 && (

              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-400
                  text-xs
                  px-1.5
                  py-0.5
                  rounded-full
                "
              >
                {
                  ei.length
                }
              </span>

            )}

          </div>

          {/* 드롭다운 */}
          {openAlarm && (

            <div
              className="
                absolute
                right-0
                mt-3
                w-80
                bg-white
                rounded-3xl
                shadow-2xl
                p-4
                z-50
                text-black
              "
            >

              {/* 제목 */}
              <div
                className="
                  font-bold
                  text-lg
                  mb-4
                "
              >
                ⚠️ 유통기한 임박
              </div>

              {/* 목록 */}
              <div className="space-y-3">

                {ei.length ===
                0 ? (

                  <div
                    className="
                      text-sm
                      text-gray-400
                      text-center
                      py-6
                    "
                  >
                    임박 재료가 없습니다 👍
                  </div>

                ) : (

                  ei.map(
                    (item) => (

                      <div
                        key={item.name}
                        onClick={() => {

                          setOpenAlarm(
                            false
                          );

                          onIngredientClick(
                            item.name
                          );

                        }}
                        className="
                          bg-orange-50
                          hover:bg-orange-100
                          rounded-2xl
                          px-4
                          py-4
                          cursor-pointer
                          transition
                          flex
                          justify-between
                          items-center
                        "
                      >

                        {/* 왼쪽 */}
                        <div>

                          <div className="font-semibold">
                            🥕 {item.name}
                          </div>

                          <div
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            {
                              item.dday
                            }
                            일 남음
                          </div>

                        </div>

                        {/* 오른쪽 */}
                        <div
                          className="
                            text-sm
                            text-orange-400
                            font-semibold
                          "
                        >
                          레시피 →
                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}