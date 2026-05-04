// pages/Home.jsx
import { useState } from "react";
import { useFridgeStore } from "../store/useFridgeStore";
import Header from "../components/Header";
import ExpireBanner from "../components/ExpireBanner";
import CategoryTabs from "../components/CategoryTabs";
import FoodCard from "../components/FoodCard";
import AddFoodModal from "../components/AddFoodModal";
import ExpireModal from "../components/ExpireModal";

export default function Home() {
  const { items, category } = useFridgeStore();

  const [openAdd, setOpenAdd] = useState(false);
  const [openExpire, setOpenExpire] = useState(false);

  const filtered =
    category === "전체"
      ? items
      : items.filter((i) => i.category === category);


 return (
    <div className="bg-gray-100 min-h-screen pb-20">

      <Header onOpenExpire={() => setOpenExpire(true)} />
      <ExpireBanner />
      <CategoryTabs />

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
        <FoodCard key={item.id} item={item} />
      ))}
    </div>

  </div>

      <button
        onClick={() => setOpenAdd(true)}
        className="floating-btn"
      >
        +
      </button>

      {openAdd && <AddFoodModal onClose={() => setOpenAdd(false)} />}
      {openExpire && (
        <ExpireModal items={items} onClose={() => setOpenExpire(false)} />
      )}
    </div>
  );
}