export default function RecommendedRecipeCard({
  recipe,
  onClick,
}) {

  return (

    <div
      onClick={onClick}
      className="
        min-w-[260px]
        max-w-[260px]
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        transition
        cursor-pointer
        flex-shrink-0
      "
    >

      <div
        className="
          h-44
          bg-gray-100
        "
      >

        <img
          src={recipe.images?.main}
          alt={recipe.recipeName}
          className="
            w-full
            h-full
            object-cover
          "
        />

      </div>

      <div className="p-4">

        <div
          className="
            text-xs
            text-orange-400
            font-semibold
            mb-2
          "
        >
          {recipe.recipeCategory}
        </div>

        <h3
          className="
            font-bold
            text-lg
            line-clamp-1
            mb-2
          "
        >
          {recipe.recipeName}
        </h3>

        <p
          className="
            text-sm
            text-gray-400
            line-clamp-2
          "
        >
          냉장고 재료 기반 추천
        </p>

        <div
          className="
            flex
            items-center
            justify-between
            mt-4
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            🔥{" "}
            {recipe.nutrition?.calories || 0}
            kcal
          </div>

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            {recipe.cookingMethod}
          </div>

        </div>

      </div>

    </div>

  );
}