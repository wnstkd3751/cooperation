import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ExpireModal from "../components/ExpireModal";
import RecipeDetailModal from "../components/RecipeDetailModal";

export default function Home() {

  const navigate = useNavigate();

  const [openExpire, setOpenExpire] =
    useState(false);

  // 추천 레시피
  const [
    recommendedRecipes,
    setRecommendedRecipes
  ] = useState([]);

  // 상세 모달
  const [
    selectedRecipe,
    setSelectedRecipe
  ] = useState(null);

  const [openDetail, setOpenDetail] =
    useState(false);

  // =========================
  // 추천 레시피 조회
  // =========================
  const fetchRecommendedRecipes =
    async () => {

      try {

        const response =
          await axios.get(
            "https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes?page=1&size=10"
          );

        setRecommendedRecipes(
          response.data.recipes || []
        );

      } catch (error) {

        console.error(
          "추천 레시피 조회 실패",
          error
        );

      }
    };

  // =========================
  // 상세 조회
  // =========================
  const fetchRecipeDetail = async (
    rcpSeq
  ) => {

    try {

      const response =
        await axios.get(
          `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes/${rcpSeq}`
        );

      setSelectedRecipe(
        response.data
      );

      setOpenDetail(true);

    } catch (error) {

      console.error(
        "레시피 상세 조회 실패",
        error
      );

    }
  };

  // =========================
  // 최초 로딩
  // =========================
  useEffect(() => {

    fetchRecommendedRecipes();

  }, []);

  return (

    <div className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <Header
        onOpenExpire={() =>
          setOpenExpire(true)
        }
      />

      <div className="p-5 pb-28">

        {/* 유통기한 카드 */}
        <div
          className="
            bg-yellow-50
            border
            border-yellow-200
            rounded-3xl
            p-5
            flex
            items-center
            justify-between
            mb-8
          "
        >

          <div>

            <div className="font-bold text-lg">
              당근 외 3개
            </div>

            <div className="text-sm text-gray-500">
              유통기한 3일 이내!
            </div>

          </div>

          <button
            onClick={() =>
              navigate("/recipe")
            }
            className="
              text-red-400
              font-semibold
            "
          >
            레시피 보기 →
          </button>

        </div>

        {/* 임박 재료 */}
        <div className="mb-10">

          <h2 className="text-2xl font-bold mb-4">
            ⚠️ 곧 상할 재료
          </h2>

          <div className="text-gray-400">
            임박한 재료가 없습니다 👍
          </div>

        </div>

        {/* ========================= */}
        {/* 추천 레시피 */}
        {/* ========================= */}
        <div>

          {/* 헤더 */}
          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <h2 className="text-2xl font-bold">
              🍳 추천 레시피
            </h2>

            <button
              onClick={() =>
                navigate("/recipe")
              }
              className="
                text-orange-400
                font-semibold
                hover:text-orange-500
                transition
              "
            >
              전체 보기 →
            </button>

          </div>

          {/* 가로 스크롤 */}
          <div
            className="
              flex
              gap-5
              overflow-x-auto
              pb-2
              scrollbar-hide
            "
          >

            {recommendedRecipes.map(
              (recipe) => (

                <div
                  key={recipe.rcpSeq}
                  onClick={() => {
                    fetchRecipeDetail(
                      recipe.rcpSeq
                    );
                  }}
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

                  {/* 이미지 */}
                  <div
                    className="
                      h-44
                      bg-gray-100
                    "
                  >

                    <img
                      src={
                        recipe.images?.main
                      }
                      alt={
                        recipe.recipeName
                      }
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </div>

                  {/* 내용 */}
                  <div className="p-4">

                    {/* 카테고리 */}
                    <div
                      className="
                        text-xs
                        text-orange-400
                        font-semibold
                        mb-2
                      "
                    >
                      {
                        recipe.recipeCategory
                      }
                    </div>

                    {/* 제목 */}
                    <h3
                      className="
                        font-bold
                        text-lg
                        line-clamp-1
                        mb-2
                      "
                    >
                      {
                        recipe.recipeName
                      }
                    </h3>

                    {/* 설명 */}
                    <p
                      className="
                        text-sm
                        text-gray-400
                        line-clamp-2
                      "
                    >
                      냉장고 재료 기반 추천
                    </p>

                    {/* 하단 */}
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
                        {
                          recipe
                            .nutrition
                            ?.calories || 0
                        }
                        kcal
                      </div>

                      <div
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        {
                          recipe.cookingMethod
                        }
                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      {/* 상세 모달 */}
      {openDetail && (

        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() =>
            setOpenDetail(false)
          }
          onStartCooking={(recipe) => {

            console.log(recipe);

          }}
        />

      )}

      {/* 유통기한 모달 */}
      {openExpire && (

        <ExpireModal
          items={[]}
          onClose={() =>
            setOpenExpire(false)
          }
        />

      )}

    </div>
  );
}