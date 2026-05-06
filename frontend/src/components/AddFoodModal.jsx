import { useState } from "react";
import { addFridgeItem } from "../api/fridgeApi";

export default function AddFoodModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
const [quantity, setQuantity] = useState(""); // 🔥 이거 추가
const [category, setCategory] = useState("");
const [purchase_date, setPurchaseDate] = useState("");
const [expire_date, setExpireDate] = useState("");
const [image, setImage] = useState("");

  const handleSubmit = async () => {
  try {
    const newItem = {
      user_id: "user123",          // 🔥 필수
      food_id: Date.now().toString(), // 🔥 임시 (나중에 개선 가능)

      name,
      quantity: Number(quantity),  // 🔥 숫자로 변환
      category,

      image: image || "",

      purchase_date,               // "2026-05-06"
      expire_date,

      created_at: new Date().toISOString(), // 🔥 필수
    };

    await addFridgeItem(newItem);

    onSuccess(); // 👉 성공 시만 닫기 + 갱신
    onClose();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="font-bold mb-3">재료 추가</h2>

        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="수량"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={handleSubmit} className="btn-primary mt-3 w-full">
          추가
        </button>
      </div>
    </div>
  );
}