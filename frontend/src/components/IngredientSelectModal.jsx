export default function IngredientSelectModal({
  open,
  ingredients = [],
  onClose,
  onSelect,
}) {

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
          max-w-md
          rounded-3xl
          p-6
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
            ⚠️ 임박 재료
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

        {/* 재료 목록 */}
        <div className="space-y-3">

          {ingredients.map((ingredient) => (

            <button
              key={ingredient}
              onClick={() =>
                onSelect(ingredient)
              }
              className="
                w-full
                flex
                items-center
                justify-between
                bg-orange-50
                hover:bg-orange-100
                rounded-2xl
                px-5
                py-4
                transition
              "
            >

              <div className="font-semibold">
                {ingredient}
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                레시피 보기 →
              </div>

            </button>

          ))}

        </div>

      </div>

    </div>

  );
}