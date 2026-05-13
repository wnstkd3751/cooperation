export default function IngredientRecipeModal({
  open,
  ingredient,
  recipes = [],
  onClose,
  onRecipeClick,
}) {


  console.log(ingredient)
  console.log(recipes)

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        z-50
        flex
        justify-center
        items-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-5xl
          rounded-3xl
          p-6
          max-h-[90vh]
          overflow-y-auto
        "
      >

        {/* 헤더 */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <h2 className="text-2xl font-bold">
            {ingredient} 레시피 추천
          </h2>

          <button
            onClick={onClose}
            className="
              text-2xl
              text-gray-400
            "
          >
            ✕
          </button>

        </div>

        {/* 레시피 리스트 */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
          "
        >

          {recipes.map((recipe) => (

            <div
              key={recipe.rcpSeq}
              onClick={() =>
                onRecipeClick(recipe)
              }
              className="
                bg-gray-50
                rounded-3xl
                overflow-hidden
                cursor-pointer
                hover:shadow-lg
                transition
              "
            >

              <img
                src={recipe.images?.main}
                alt={recipe.recipeName}
                className="
                  w-full
                  h-44
                  object-cover
                "
              />

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
                    line-clamp-1
                  "
                >
                  {recipe.recipeName}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}