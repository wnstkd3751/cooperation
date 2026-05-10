export default function RecipeCard({ recipe }) {

  return (

    <div className="
      bg-gradient-to-br from-orange-50 to-white
      rounded-2xl
      overflow-hidden
      shadow-sm
      border border-gray-100
      hover:shadow-md
      transition
    ">

      {/* 이미지 */}
      <div className="
        h-52
        bg-gray-50
        flex
        items-center
        justify-center
        p-4
      ">

        <img
          src={recipe.images?.main}
          alt={recipe.recipeName}
          className="
            max-h-full
            max-w-full
            object-contain
          "
        />
      </div>

      {/* 내용 */}
      <div className="p-4">

        <h3 className="
          font-semibold
          text-base
          line-clamp-2
          min-h-[48px]
        ">
          {recipe.recipeName}
        </h3>

        <div className="
          flex
          flex-wrap
          items-center
          gap-2
          mt-3
          text-xs
          text-gray-500
        ">

          <span className="
            bg-orange-100
            text-orange-600
            px-2 py-1
            rounded-full
          ">
            {recipe.recipeCategory}
          </span>

          <span>
            {recipe.cookingMethod}
          </span>
        </div>

        <div className="
          mt-4
          flex
          items-center
          justify-between
        ">

          <span className="
            text-sm
            font-semibold
            text-green-600
          ">
            {recipe.nutrition?.calories} kcal
          </span>

          <button className="
            text-xs
            bg-gray-100
            hover:bg-gray-200
            px-3 py-1
            rounded-lg
            transition
          ">
            상세보기
          </button>
        </div>
      </div>
    </div>
  );
}