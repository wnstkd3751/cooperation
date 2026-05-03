// components/Header.jsx
export default function Header({ onOpenExpire }) {
  return (
    <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10">
      <h1 className="text-lg font-bold">내 냉장고</h1>

      <button onClick={onOpenExpire} className="text-red-400 text-xl">
        🔔
      </button>
    </div>
  );
}