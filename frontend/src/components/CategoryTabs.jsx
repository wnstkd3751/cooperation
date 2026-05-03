// components/CategoryTabs.jsx
import { useFridgeStore } from "../store/useFridgeStore";

const categories = ["전체", "채소", "육류", "유제품", "기타"];

export default function CategoryTabs() {
  const { category, setCategory } = useFridgeStore();

  return (
    <div className="flex gap-2 px-4 mt-4 overflow-x-auto">

      {categories.map((c) => (
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
  );
}