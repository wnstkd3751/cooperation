// components/ExpireBanner.jsx
export default function ExpireBanner() {
  return (
    <div className="mx-6 mt-4 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 flex justify-between items-center">

      <div>
        <p className="font-semibold">당근 외 3개</p>
        <p className="text-sm text-gray-500">유통기한 3일 이내!</p>
      </div>

      <button className="text-red-400 font-semibold">
        레시피 보기 →
      </button>
    </div>
  );
}