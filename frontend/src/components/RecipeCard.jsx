export default function RecipeCard({ recipe }) {
  const percent = (recipe.have / recipe.total) * 100;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow">
      <img src={recipe.image} className="h-40 w-full object-cover" />

      <div className="p-3">
        <h3 className="font-semibold">{recipe.name}</h3>

        <div className="text-xs text-gray-500 flex gap-2 mt-1">
          <span>{recipe.level}</span>
          <span>{recipe.time}</span>
          <span>{recipe.kcal}kcal</span>
        </div>

        <div className="mt-2">
          <p className="text-green-600 text-sm">
            재료 {recipe.have}/{recipe.total} 보유
          </p>

          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-green-400 h-2 rounded"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}