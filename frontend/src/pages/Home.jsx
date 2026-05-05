import { useFridgeStore } from "../store/useFridgeStore";
import Header from "../components/Header";
import ExpireBanner from "../components/ExpireBanner";
import { useState } from "react";
import ExpireModal from "../components/ExpireModal";
import RecipeModal from "../components/RecipeModal";

export default function Home() {
  

  
  const { items } = useFridgeStore();

  // 유통기한 임박 (3일 이내)
  const urgentItems = items
    .filter((i) => i.dday <= 3)
    .sort((a, b) => a.dday - b.dday)
    .slice(0, 3);
  const [openExpire, setOpenExpire] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(false);
  
  return (
    
    
    <div>
      <Header onOpenExpire={() => setOpenExpire(true)} />
      <ExpireBanner onOpenRecipe={() => setOpenRecipe(true)} />
      
      <div className="max-w-6xl mx-auto space-y-6 relative top-3">
      {/* 🔥 유통기한 임박 */}
      <h2 className="text-lg font-bold mb-3">⚠️ 곧 상할 재료</h2>

      <div className="space-y-3">
        {urgentItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-400">{item.amount}</p>
            </div>
            <span className="text-sm text-red-400 font-semibold">
              D-{item.dday}
            </span>
          </div>
        ))}
      </div>

      {/* 🔥 추천 레시피 */}
      <h2 className="text-lg font-bold mt-6 mb-3">🍳 추천 레시피</h2>

      <div className="grid gap-4">
        {["김치볶음밥", "계란말이", "당근 볶음"].map((recipe, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm">
            <p className="font-semibold">{recipe}</p>
            <p className="text-sm text-gray-400 mt-1">
              냉장고 재료 기반 추천
            </p>
          </div>
        ))}
      </div>

    </div>
          {openExpire && (
            <ExpireModal items={items} onClose={() => setOpenExpire(false)} />
          )}
          {openRecipe && (
  <RecipeModal onClose={() => setOpenRecipe(false)} />
)}
    </div>
  );
}