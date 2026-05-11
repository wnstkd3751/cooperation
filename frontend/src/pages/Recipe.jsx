import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import Header from "../components/Header";
import ExpireModal from "../components/ExpireModal";
import RecipeCard from "../components/RecipeCard";
import CookingModal from "../components/CookingModal";
import RecipeDetailModal from "../components/RecipeDetailModal";

export default function Recipe() {

  const [recipes, setRecipes] = useState([]);

  const [category, setCategory] =
    useState("전체");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [openExpire, setOpenExpire] =
    useState(false);

  // 검색 타입
  const [searchType, setSearchType] =
    useState("recipe");

  // 검색 키워드
  const [keyword, setKeyword] =
    useState("");

  // 상세 모달
  const [selectedRecipe, setSelectedRecipe] =
    useState(null);

  const [openDetail, setOpenDetail] =
    useState(false);

  // 요리 모달
  const [openCooking, setOpenCooking] =
    useState(false);

  const [cookingRecipe, setCookingRecipe] =
    useState(null);

  // 무한 스크롤 observer
  const observerRef = useRef(null);

  // =========================
  // 레시피 가져오기
  // =========================
  const fetchRecipes = async () => {

  try {

    setLoading(true);

    let url =
      `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes?page=${page}&size=16`;

    // 카테고리
    if (category !== "전체") {

      url += `&category=${category}`;

    }

    // 검색
    if (keyword.trim() !== "") {

      url += `&keyword=${keyword}`;

      url += `&searchType=${searchType}`;

    }

    const response = await axios.get(url);

    const newRecipes =
      Array.isArray(response.data.recipes)
        ? response.data.recipes
        : [];

    setRecipes((prev) =>

      page === 1
        ? newRecipes
        : [...prev, ...newRecipes]

    );

    setTotalPages(
      response.data.totalPages || 1
    );

  } catch (error) {

    console.error(
      "레시피 조회 실패",
      error
    );

  } finally {

    setLoading(false);

  }
};

  // =========================
  // 상세 조회
  // =========================
  const fetchRecipeDetail = async (
    rcpSeq
  ) => {

    try {

      const response = await axios.get(
        `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes/${rcpSeq}`
      );

      setSelectedRecipe(response.data);

      setOpenDetail(true);

    } catch (error) {

      console.error(
        "레시피 상세 조회 실패",
        error
      );

    }
  };

  // =========================
  // page/category 변경 시 조회
  // =========================
  useEffect(() => {

    fetchRecipes();

  }, [page, category]);

  // =========================
  // 무한 스크롤
  // =========================
  useEffect(() => {

    const observer =
      new IntersectionObserver(
        (entries) => {

          const target = entries[0];

          if (
            target.isIntersecting &&
            !loading &&
            page < totalPages
          ) {

            setPage((prev) => prev + 1);

          }
        },
        {
          threshold: 0.3,
        }
      );

    if (observerRef.current) {

      observer.observe(observerRef.current);

    }

    return () => {

      if (observerRef.current) {

        observer.unobserve(
          observerRef.current
        );

      }
    };

  }, [loading, page, totalPages]);

  return (

    <div>

      <Header
        onOpenExpire={() =>
          setOpenExpire(true)
        }
      />

      <div className="p-6 pb-24">

        {/* 제목 */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-6
          "
        >

          <h2 className="text-2xl font-bold">
            🍳 레시피
          </h2>

        </div>

        {/* ========================= */}
        {/* 검색 */}
        {/* ========================= */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-2
            mb-5
          "
        >

          {/* 검색 타입 */}
          <select
            value={searchType}
            onChange={(e) =>
              setSearchType(e.target.value)
            }
            className="
              border
              rounded-xl
              px-3
              py-2
              text-sm
              bg-white
            "
          >

            <option value="recipe">
              레시피명
            </option>

            <option value="ingredient">
              재료
            </option>

          </select>

          {/* 검색창 */}
          <input
            type="text"
            placeholder={
              searchType === "recipe"
                ? "레시피 검색"
                : "재료 검색"
            }
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                setRecipes([]);

                setPage(1);

                fetchRecipes();

              }
            }}
            className="
              flex-1
              border
              rounded-xl
              px-4
              py-2
              text-sm
              bg-white
            "
          />

          {/* 검색 버튼 */}
          <button
            onClick={() => {

              setRecipes([]);

              setPage(1);

              fetchRecipes();

            }}
            className="
              bg-orange-400
              hover:bg-orange-500
              text-white
              px-5
              py-2
              rounded-xl
              text-sm
              transition
            "
          >
            검색
          </button>

        </div>

        {/* 카테고리 */}
        <div
          className="
            flex
            gap-2
            mb-5
            flex-wrap
          "
        >

          {[
            "전체",
            "반찬",
            "국&찌개",
            "후식",
            "밥",
            "일품",
          ].map((c) => (

            <button
              key={c}
              onClick={() => {

                setCategory(c);

                setRecipes([]);

                setPage(1);

              }}
              className={`category-btn ${
                category === c
                  ? "active"
                  : ""
              }`}
            >
              {c}
            </button>

          ))}

        </div>

        {/* 레시피 리스트 */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            xl:grid-cols-8
            gap-5
          "
        >

          {recipes.map((recipe) => (

            <RecipeCard
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

        {/* 결과 없음 */}
        {!loading &&
          recipes.length === 0 && (

          <div
            className="
              text-center
              py-20
              text-gray-400
            "
          >
            검색 결과가 없습니다.
          </div>

        )}

        {/* 로딩 */}
        {loading && (

          <div
            className="
              text-center
              py-10
              text-gray-500
            "
          >
            🍳 레시피 불러오는 중...
          </div>

        )}

        {/* observer */}
        <div
          ref={observerRef}
          className="h-10"
        />

      </div>

      {/* 상세 모달 */}
      {openDetail && (

        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() =>
            setOpenDetail(false)
          }
          onStartCooking={(recipe) => {

            setCookingRecipe(recipe);

            setOpenCooking(true);

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

      {/* 요리 모달 */}
      {openCooking && (

        <CookingModal
          recipe={cookingRecipe}
          onClose={() =>
            setOpenCooking(false)
          }
        />

      )}

    </div>
  );
}