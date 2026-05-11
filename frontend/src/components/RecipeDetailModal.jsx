export default function RecipeDetailModal({
  recipe,
  onClose,
  onStartCooking,
}) {
  if (!recipe) return null;

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
          overflow-hidden
          relative
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            z-10
            w-10
            h-10
            rounded-full
            bg-black/40
            text-white
          "
        >
          ✕
        </button>

        {/* 대표 이미지 */}
        <div
  className="
    relative
    w-full
    h-[350px]
    bg-gray-100
    overflow-hidden
  "
>

  {/* 이미지 가운데 */}
  <div
    className="
      w-full
      h-full
      flex
      items-center
      justify-center
    "
  >
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

  {/* 제목 오버레이 */}
  <div
    className="
      absolute
      bottom-0
      left-0
      right-0
      p-6
      bg-gradient-to-t
      from-black/70
      to-transparent
    "
  >
    <h2 className="text-3xl font-bold text-white">
      {recipe.recipeName}
    </h2>

    <div className="flex gap-2 mt-3 flex-wrap">
      {recipe.hashtags?.map((tag) => (
        <span
          key={tag}
          className="
            bg-white/20
            backdrop-blur-sm
            text-white
            px-3
            py-1
            rounded-full
            text-sm
          "
        >
          #{tag}
        </span>
      ))}
    </div>
  </div>

</div>

        <div className="p-6">

          {/* 정보 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 ">

            <div className="bg-gray-100 rounded-2xl p-5 text-center">
              <div className="text-orange-400 text-2xl">
                🍳
              </div>

              <div className="font-bold mt-2">
                {recipe.cookingMethod}
              </div>

              <div className="text-sm text-gray-400">
                조리방식
              </div>
            </div>

        
            <div className="bg-gray-100 rounded-2xl p-5 text-center">
              <div className="text-orange-400 text-2xl">
                🔥
              </div>

              <div className="font-bold mt-2">
                {recipe.nutrition?.calories} kcal
              </div>

              <div className="text-sm text-gray-400">
                칼로리
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5 text-center">
              <div className="text-orange-400 text-2xl">
                🧂
              </div>

              <div className="font-bold mt-2">
                {recipe.nutrition?.sodium} mg
              </div>

              <div className="text-sm text-gray-400">
                나트륨
              </div>
            </div>

          </div>

          {/* 영양정보 */}
          <div className="mb-10">

            <h3 className="text-xl font-bold mb-4">
              📊 영양 정보
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-sm text-gray-500">
                  탄수화물
                </div>

                <div className="font-bold text-lg">
                  {recipe.nutrition?.carbohydrate}g
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-sm text-gray-500">
                  단백질
                </div>

                <div className="font-bold text-lg">
                  {recipe.nutrition?.protein}g
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-sm text-gray-500">
                  지방
                </div>

                <div className="font-bold text-lg">
                  {recipe.nutrition?.fat}g
                </div>
              </div>

            </div>

          </div>

          {/* 재료 */}
          <div className="mb-10">

            <h3 className="text-xl font-bold mb-4">
              🥬 재료
            </h3>

            <div className="space-y-3">

              {recipe.ingredients?.map((item, idx) => (
                <div
                  key={idx}
                  className="
                    flex
                    justify-between
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-3
                  "
                >
                  <span>{item.name}</span>

                  <span className="text-gray-500">
                    {item.amount}
                  </span>
                </div>
              ))}

            </div>

          </div>

          {/* 저염 팁 */}
          {recipe.sodiumTip && (
            <div
              className="
                bg-blue-50
                border
                border-blue-100
                rounded-2xl
                p-5
                mb-10
              "
            >
              <h3 className="font-bold mb-2">
                🧂 저염 팁
              </h3>

              <p className="text-gray-600">
                {recipe.sodiumTip}
              </p>
            </div>
          )}

          {/* 요리 시작 */}
          <button
            onClick={() =>
              onStartCooking(recipe)
            }
            className="
              w-full
              bg-orange-400
              hover:bg-orange-500
              text-white
              py-4
              rounded-2xl
              text-lg
              font-bold
              transition
            "
          >
            🍳 요리 시작
          </button>

        </div>
      </div>
    </div>
  );
}