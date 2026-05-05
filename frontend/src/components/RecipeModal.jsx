// components/RecipeModal.jsx
export default function RecipeModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2 className="text-lg font-semibold mb-4">추천 레시피</h2>

        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl">
            김치볶음밥
            <p className="text-xs text-gray-400">추천 이유: 재료 활용</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            계란말이
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            당근 볶음
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary mt-4 w-full"
        >
          닫기
        </button>

      </div>
    </div>
  );
}