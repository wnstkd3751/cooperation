// components/AddFoodModal.jsx
import { useState } from "react";
import { useFridgeStore } from "../store/useFridgeStore";

export default function AddFoodModal({ onClose }) {
  const addItem = useFridgeStore((s) => s.addItem);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    if (!name) return;

    addItem({
      id: Date.now(),
      name,
      amount,
      dday: 3,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2 className="font-bold text-lg">식재료 추가</h2>

        <input className="input" placeholder="식재료 이름" />
        <input className="input" placeholder="수량" />

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="btn-gray flex-1">
            취소
          </button>

          <button className="btn-primary flex-1">
            추가
          </button>
        </div>

      </div>
    </div>
  );
}