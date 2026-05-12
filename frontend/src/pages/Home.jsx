import { useEffect, useState } from "react";

import axios from "axios";

import Header from "../components/Header";
import ExpireModal from "../components/ExpireModal";
import RecipeDetailModal from "../components/RecipeDetailModal";

import IngredientSelectModal from "../components/IngredientSelectModal";
import IngredientRecipeModal from "../components/IngredientRecipeModal";
import RecommendedRecipeCard from "../components/RecommendedRecipeCard";

export default function Home() {

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

  // 추천 레시피 모달
  const [
    openRecommendModal,
    setOpenRecommendModal
  ] = useState(false);

  const [
    ingredientRecipes,
    setIngredientRecipes
  ] = useState([]);

  // 임박 재료 선택 모달
  const [
    openIngredientModal,
    setOpenIngredientModal
  ] = useState(false);

  // 선택된 재료
  const [
    selectedIngredient,
    setSelectedIngredient
  ] = useState("");

  // 임박 재료 목록
  const expiringIngredients = [
    "당근",
    "양파",
    "감자",
    "두부",
  ];

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
  // 레시피 상세 조회
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
  // 재료 기반 추천 조회
  // =========================
  const fetchIngredientRecipes =
    async (ingredient) => {

      try {

        console.log(
          "선택된 재료:",
          ingredient
        );

        const searchType = "recipe";

        const response =
  await axios.get(
          `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes?keyword=${ingredient}&page=1&size=10&searchType=${searchType}`
  );

        setIngredientRecipes(
          response.data.recipes || []
        );

        setSelectedIngredient(
          ingredient
        );

        setOpenIngredientModal(false);

        setOpenRecommendModal(true);

      } catch (error) {

        console.error(
          "재료 추천 조회 실패",
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

  onIngredientClick={
    fetchIngredientRecipes
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
              setOpenIngredientModal(true)
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

        {/* 추천 레시피 */}
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

            {recommendedRecipes.map((recipe) => (

              <RecommendedRecipeCard
                key={recipe.rcpSeq}
                recipe={recipe}
                onClick={() => {
                  fetchRecipeDetail(
                    recipe.rcpSeq
                  );
                }}
              />

            ))}

          </div>

        </div>

      </div>

      {/* 재료 선택 모달 */}
      <IngredientSelectModal
        open={openIngredientModal}
        ingredients={expiringIngredients}
        onClose={() =>
          setOpenIngredientModal(false)
        }
        onSelect={fetchIngredientRecipes}
      />

      {/* 재료 추천 모달 */}
      <IngredientRecipeModal
        open={openRecommendModal}
        ingredient={selectedIngredient}
        recipes={ingredientRecipes}
        onClose={() =>
          setOpenRecommendModal(false)
        }
        onSelectRecipe={(recipe) => {

          setOpenRecommendModal(false);

          fetchRecipeDetail(
            recipe.rcpSeq
          );

        }}
      />

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
          items={expiringIngredients}
          onClose={() =>
            setOpenExpire(false)
          }
        />

      )}

    </div>
  );
}