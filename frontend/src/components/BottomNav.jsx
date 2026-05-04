import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const menus = [
    { path: "/", label: "홈" },
    { path: "/fridge", label: "냉장고" },
    { path: "/recipe", label: "레시피" },
    { path: "/setting", label: "설정" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md">
      <div className="max-w-[420px] mx-auto flex justify-around py-2">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-red-400 font-semibold" : "text-gray-400"
              }`}
            >
              <span className="text-lg">
                {menu.label === "홈" && "🏠"}
                {menu.label === "냉장고" && "🧊"}
                {menu.label === "레시피" && "🍳"}
                {menu.label === "설정" && "⚙️"}
              </span>
              {menu.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}