import { useState } from "react";
import { addFridgeItem } from "../api/fridgeApi";

export default function AddFoodModal({ onClose }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("기타");

  const handleSubmit = async () => {
    try {
      await addFridgeItem({
        user_id: "user123",
        name,
        quantity: amount,
        category,
        expire_date: "2026-05-10",
        image: "",
      });

      alert("추가 완료!");
      onClose();
    } catch (e) {
      console.error(e);
      alert("에러 발생");
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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleSubmit} className="btn-primary mt-3 w-full">
          추가
        </button>
      </div>
    </div>
  );
}