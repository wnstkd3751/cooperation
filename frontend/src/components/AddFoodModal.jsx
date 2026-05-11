import { useState } from "react";
import { addFridgeItem } from "../api/fridgeApi";
import axios from "axios";

export default function AddFoodModal({ onClose, onSuccess }) {

  const [imageFile, setImageFile] = useState(null);

  // 🔥 OCR 결과 배열
  const [items, setItems] = useState([]);

  // =========================
  // OCR 요청
  // =========================
  const handleOCR = async () => {

    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {

      const res = await axios.post(
        "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/api/ocr/clova",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 🔥 items 배열 저장
      setItems(
        res.data.items.map((item) => ({
          ...item,
          checked: true,
        }))
      );

    } catch (err) {
      console.error("OCR 실패:", err);
    }
  };

  // =========================
  // 체크박스 변경
  // =========================
  const toggleItem = (index) => {

    const updated = [...items];

    updated[index].checked = !updated[index].checked;

    setItems(updated);
  };

  // =========================
  // 이름 수정
  // =========================
  const changeName = (index, value) => {

    const updated = [...items];

    updated[index].name = value;

    setItems(updated);
  };

  // =========================
  // 수량 수정
  // =========================
  const changeQuantity = (index, value) => {

    const updated = [...items];

    updated[index].quantity = value;

    setItems(updated);
  };

  // =========================
  // 냉장고 저장
  // =========================
  const handleSubmit = async () => {

    try {

      const selectedItems = items.filter((item) => item.checked);

      for (const item of selectedItems) {

        const newItem = {
          user_id: "user123",
          food_id: Date.now().toString(),

          name: item.name,
          quantity: Number(item.quantity),

          category: "",

          purchase_date: "",
          expire_date: "",

          image: "",

          created_at: new Date().toISOString(),
        };

        await addFridgeItem(newItem);
      }

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      
      <div className="modal-box relative">

{/* X 버튼 */}
  <button
    onClick={onClose}
    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
  >
    ✕
  </button>
        <h2 className="font-bold text-lg mb-3">
          영수증 OCR 등록
        </h2>

        {/* 이미지 업로드 */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button
          onClick={handleOCR}
          className="btn-primary mt-3 w-full"
        >
          OCR 분석하기
        </button>

        {/* OCR 결과 */}
        <div className="mt-4 space-y-3">

          {items.map((item, index) => (

            <div
              key={index}
              className="border p-3 rounded flex items-center gap-2"
            >

              {/* 체크박스 */}
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(index)}
              />

              {/* 이름 */}
              <input
                className="input flex-1"
                value={item.name}
                onChange={(e) =>
                  changeName(index, e.target.value)
                }
              />

              {/* 수량 */}
              <input
                className="input w-20"
                value={item.quantity}
                onChange={(e) =>
                  changeQuantity(index, e.target.value)
                }
              />

            </div>
          ))}
        </div>

        {/* 저장 버튼 */}
        {items.length > 0 && (
          <button
            onClick={handleSubmit}
            className="btn-primary mt-4 w-full"
          >
            선택 항목 추가
          </button>
        )}
      </div>
    </div>
  );
}