// components/FoodCard.jsx
export default function FoodCard({ item }) {
  const getColor = () => {
    if (item.dday <= 1) return "dday-red";
    if (item.dday <= 3) return "dday-yellow";
    return "dday-green";
  };

  return (
    <div className="card flex flex-col items-center">

      <img
        src={item.image || "/img/default.png"}
        className="w-16 h-16 object-contain"
      />

      <span className={`text-xs px-3 py-1 rounded-full mt-2 ${getColor()}`}>
        D-{item.dday}
      </span>

      <h3 className="mt-2 font-semibold text-sm">{item.name}</h3>
      <p className="text-gray-400 text-xs">{item.amount}</p>
    </div>
  );
}