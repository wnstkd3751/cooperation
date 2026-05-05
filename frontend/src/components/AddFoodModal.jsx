import { useState } from "react";
import { useFridgeStore } from "../store/useFridgeStore";

export default function AddFoodModal({ onClose }) {
  const addItem = useFridgeStore((s) => s.addItem);

  const [form, setForm] = useState({
    name: "",
    category: "채소",
    amount: "",
    dday: 3,
  });

  const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImage(file);
  setPreview(URL.createObjectURL(file));
};

  const handleSubmit = () => {
    if (!form.name) return;

    addItem({
      id: Date.now(),
      ...form,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">식재료 추가</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* 입력 */}
        <div className="mt-4">

          {/* 이름 */}
          <label className="text-sm font-medium">식재료 이름</label>
          <input
            className="input"
            placeholder="예: 당근"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* 이미지 업로드 */}
        <div className="mt-3">
          <label className="text-sm text-gray-500">이미지</label>

          <input type="file" accept="image/*" onChange={handleImage} />

          {preview && (
            <img
              src={preview}
              className="mt-2 w-20 h-20 object-cover rounded-lg"
            />
          )}
        </div>

          {/* 카테고리 */}
          <label className="text-sm font-medium mt-4 block">
            카테고리
          </label>
          <div className="flex gap-2 mt-2">
            {["채소", "육류", "유제품", "기타"].map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, category: c })}
                className={`category-btn ${
                  form.category === c ? "active" : ""
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 수량 */}
          <label className="text-sm font-medium mt-4 block">
            수량
          </label>
          <input
            className="input"
            placeholder="예: 3개, 300g"
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          {/* D-day */}
          <label className="text-sm font-medium mt-4 block">
            유통기한 (D-day)
          </label>
          <input
            type="number"
            className="input"
            onChange={(e) =>
              setForm({ ...form, dday: Number(e.target.value) })
            }
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 mt-6">
          <button className="btn-gray" onClick={onClose}>
            취소
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}