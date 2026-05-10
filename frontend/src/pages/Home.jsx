import Header from "../components/Header";
import ExpireBanner from "../components/ExpireBanner";
import { useState, useEffect } from "react";
import ExpireModal from "../components/ExpireModal";
import RecipeModal from "../components/RecipeModal";
import { getFridgeItems } from "../api/fridgeApi";

export default function Home() {
  const [items, setItems] = useState([]);

  

  const [openExpire, setOpenExpire] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(false);

  // 데이터 불러오기
  const fetchData = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      console
      const data = await getFridgeItems(user_id);

      const today = new Date();

      const withDday = data.map((item) => {
        const expire = new Date(item.expire_date);
        const diff = Math.ceil(
          (expire - today) / (1000 * 60 * 60 * 24)
        );

        return {
          ...item,
          dday: diff,
        };
      });

      setItems(withDday);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 유통기한 임박 (3일 이내)
  const urgentItems = items
    .filter((i) => i.dday <= 3)
    .sort((a, b) => a.dday - b.dday)
    .slice(0, 3);

  return (
    <div>
      <Header onOpenExpire={() => setOpenExpire(true)} />
      <ExpireBanner onOpenRecipe={() => setOpenRecipe(true)} />

      <div className="max-w-6xl mx-auto space-y-6 relative top-3 px-4">

        {/* 유통기한 임박 */}
        <h2 className="text-lg font-bold mb-3">⚠️ 곧 상할 재료</h2>

        <div className="space-y-3">
          {urgentItems.length === 0 ? (
            <p className="text-gray-400 text-sm">
              임박한 재료가 없습니다 👍
            </p>
          ) : (
            urgentItems.map((item) => (
              <div
                key={item.item_id}
                className="bg-white p-4 rounded-xl shadow-sm flex justify-between"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.quantity}
                  </p>
                </div>
                <span className="text-sm text-red-400 font-semibold">
                  D-{item.dday}
                </span>
              </div>
            ))
          )}
        </div>

        {/* 추천 레시피 */}
        <h2 className="text-lg font-bold mt-6 mb-3">추천 레시피</h2>

        <div className="grid gap-4">
          {["김치볶음밥", "계란말이", "당근 볶음"].map(
            (recipe, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow-sm"
              >
                <p className="font-semibold">{recipe}</p>
                <p className="text-sm text-gray-400 mt-1">
                  냉장고 재료 기반 추천
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* 모달 */}
      {openExpire && (
        <ExpireModal
          items={items}
          onClose={() => setOpenExpire(false)}
        />
      )}

      {openRecipe && (
        <RecipeModal onClose={() => setOpenRecipe(false)} />
      )}
    </div>
  );
}