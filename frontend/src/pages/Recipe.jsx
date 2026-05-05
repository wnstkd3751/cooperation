import { useState } from "react";
import Header from "../components/Header";
import ExpireModal from "../components/ExpireModal";

const mockRecipes = [
  { id: 1, name: "김치볶음밥", category: "한식", likes: 10 },
  { id: 2, name: "파스타", category: "양식", likes: 5 },
  { id: 3, name: "오므라이스", category: "일식", likes: 7 },
];
export default function Recipe() {
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("인기");

  const [openExpire, setOpenExpire] = useState(false);

  let filtered =
    category === "전체"
      ? mockRecipes
      : mockRecipes.filter((r) => r.category === category);

  if (sort === "인기") {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  }

  return (
    <div>
      <Header onOpenExpire={() => setOpenExpire(true)} />
    
    <div className="p-6 pb-24">
      

      <h2 className="text-xl font-bold mb-4">🍳 레시피</h2>

      {/* 카테고리 */}
      <div className="flex gap-2 mb-4">
        {["전체", "한식", "양식", "일식"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`category-btn ${
              category === c ? "active" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        >
          <option>인기</option>
          <option>최신</option>
        </select>
      </div>

      {/* 리스트 */}
      <div className="grid gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm">
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm text-gray-400">{r.category}</p>
          </div>
        ))}
      </div>

    </div>
          {openExpire && (
            <ExpireModal items={items} onClose={() => setOpenExpire(false)} />
          )}
    </div>
  );
}