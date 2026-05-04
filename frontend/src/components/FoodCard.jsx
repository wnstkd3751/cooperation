// components/FoodCard.jsx
export default function FoodCard({ item }) {
  const getColor = () => {
    if (item.dday <= 1) return "dday-red";
    if (item.dday <= 3) return "dday-yellow";
    return "dday-green";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex">

      {/* 이미지 */}
      <div className="w-1/3 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={item.image || "/img/default.png"}
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* 정보 */}
      <div className="flex-1 p-4 flex flex-col justify-between">

        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-400 mt-1">
            구매: 1/18
          </p>
          <p className="text-sm mt-2">{item.amount}</p>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className={`text-xs px-3 py-1 rounded-full ${getColor()}`}>
            D-{item.dday}
          </span>

          <div className="w-5 h-5 border rounded-full"></div>
        </div>
      </div>
    </div>
  );
}