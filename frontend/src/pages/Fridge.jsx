import { useState, useEffect } from "react";
import Header from "../components/Header";
import ExpireBanner from "../components/ExpireBanner";
import CategoryTabs from "../components/CategoryTabs";
import FoodCard from "../components/FoodCard";
import AddFoodModal from "../components/AddFoodModal";
import ExpireModal from "../components/ExpireModal";
import RecipeModal from "../components/RecipeModal";
import { getFridgeItems } from "../api/fridgeApi";

export default function Fridge() {

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("전체");

  const [openAdd, setOpenAdd] = useState(false);
  const [openExpire, setOpenExpire] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(false);

  // 데이터 불러오기
  const fetchData = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const data = await getFridgeItems(user_id);

      // D-day 계산
      const today = new Date();

      const withDday = data.map((item) => {
        const expire = new Date(item.expire_date);
        const diff = Math.ceil((expire - today) / (1000 * 60 * 60 * 24));

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

  // 카테고리 필터
  const filtered =
    category === "전체"
      ? items
      : items.filter((i) => i.category === category);

  return (
    <div>

      <Header onOpenExpire={() => setOpenExpire(true)} />
      <ExpireBanner onOpenRecipe={() => setOpenRecipe(true)} />

      <div className="relative">
        {/* CategoryTabs에 상태 연결 */}
        <CategoryTabs
          category={category}
          setCategory={setCategory}
        />

        {/* 추가 버튼 */}
        <button
          onClick={() => setOpenAdd(true)}
          className="
            absolute right-8 top-0
            w-12 h-12
            rounded-full
            bg-red-400 text-white text-2xl
            flex items-center justify-center
            shadow-lg
          "
        >
          +
        </button>
      </div>

      {/* 리스트 */}
      <div className="max-w-6xl mx-auto">
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-6 
          px-6 
          mt-6
        ">
          {filtered.map((item) => (
            <FoodCard key={item.item_id} item={item} />
          ))}
        </div>
      </div>

      {/* 모달들 */}
      {openAdd && (
        <AddFoodModal
          onClose={() => {
            setOpenAdd(false);
             // 추가 후 자동 갱신 핵심
          }}
          onSuccess={fetchData}
        />
      )}

      {openExpire && (
        <ExpireModal items={items} onClose={() => setOpenExpire(false)} />
      )}

      {openRecipe && (
        <RecipeModal onClose={() => setOpenRecipe(false)} />
      )}
    </div>
  );
}