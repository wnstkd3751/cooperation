import { useState } from "react";
import { useFridgeStore } from "../store/useFridgeStore";
import Header from "../components/Header";
import ExpireBanner from "../components/ExpireBanner";
import CategoryTabs from "../components/CategoryTabs";
import FoodCard from "../components/FoodCard";
import AddFoodModal from "../components/AddFoodModal";
import ExpireModal from "../components/ExpireModal";
import RecipeModal from "../components/RecipeModal";

export default function Fridge() {
  const { items, category } = useFridgeStore();

  const [openAdd, setOpenAdd] = useState(false);
  const [openExpire, setOpenExpire] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(false);
  const filtered =
    category === "전체"
      ? items
      : items.filter((i) => i.category === category);

  return (
    <div>

   
      <Header onOpenExpire={() => setOpenExpire(true)} />
  <ExpireBanner onOpenRecipe={() => setOpenRecipe(true)} />
      <div className="relative">
      <CategoryTabs />
      {/* ➕ 버튼 (헤더 아래 오른쪽) */}
        <button
          onClick={() => setOpenAdd(true)}
          className="
            absolute top-0 bottom-1 right-10 
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


      <div className="max-w-6xl mx-auto ">
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-6 
          px-6 
          mt-6
        ">
          {filtered.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {openAdd && <AddFoodModal onClose={() => setOpenAdd(false)} />}
      {openExpire && (
        <ExpireModal items={items} onClose={() => setOpenExpire(false)} />
      )}
      {openRecipe && (
        <RecipeModal onClose={() => setOpenRecipe(false)} />
      )}
    </div>
  );
}