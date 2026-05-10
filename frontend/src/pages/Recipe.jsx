import { useEffect, useState } from "react";

import axios from "axios";

import Header from "../components/Header";

import ExpireModal from "../components/ExpireModal";

import RecipeCard from "../components/RecipeCard";


export default function Recipe() {

  const [recipes, setRecipes] = useState([]);

  const [category, setCategory] = useState("전체");

  // const [sort, setSort] = useState("인기");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [openExpire, setOpenExpire] = useState(false);

  // 검색 타입
  const [searchType, setSearchType] = useState("recipe");

  // 검색 키워드
  const [keyword, setKeyword] = useState("");


  // =========================
  // 레시피 가져오기
  // =========================
  const fetchRecipes = async () => {

    try {

      setLoading(true);

      let url =
        `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes?page=${page}&size=16`;


      // =========================
      // 검색
      // =========================
      if (keyword.trim() !== "") {

        // 레시피명 검색
        if (searchType === "recipe") {

          url =
            `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes/search` +
            `?keyword=${keyword}` +
            `&page=${page}&size=16`;
        }

        // 재료 검색
        else {

          url =
            `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes/ingredient/search` +
            `?ingredient=${keyword}` +
            `&page=${page}&size=16`;
        }
      }

      // =========================
      // 카테고리 필터
      // =========================
      else if (category !== "전체") {

        url =
          `https://ideal-giggle-jj675qvvwprw2pp79-8000.app.github.dev/recipes/category/${category}` +
          `?page=${page}&size=16`;
      }

      const response = await axios.get(url);

      setRecipes(
        Array.isArray(response.data.recipes)
        ? response.data.recipes
        : []
      );

      setTotalPages(response.data.totalPages);

    } catch (error) {

      console.error("레시피 조회 실패", error);

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // category/page 변경 시 재조회
  // =========================
  useEffect(() => {

    fetchRecipes();

  }, [page, category]);


  // =========================
  // 정렬
  // =========================
  // let filtered = [...recipes];

  // if (sort === "인기") {

  //   filtered.sort(
  //     (a, b) =>
  //       (b.likes || 0) - (a.likes || 0)
  //   );
  // }


  return (

    <div>

      <Header onOpenExpire={() => setOpenExpire(true)} />

      <div className="p-6 pb-24">

        {/* 제목 */}
        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        ">

          <h2 className="text-2xl font-bold">
            🍳 레시피
          </h2>

          {/* 정렬 */}
          {/* <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="
              border
              rounded-xl
              px-3
              py-2
              text-sm
              bg-white
              w-fit
            "
          >
            <option>인기</option>
            <option>최신</option>
          </select> */}
        </div>


        {/* ========================= */}
        {/* 검색 */}
        {/* ========================= */}
        <div className="
          flex
          flex-col
          sm:flex-row
          gap-2
          mb-5
        ">

          {/* 검색 타입 */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
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
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter") {

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
        <div className="
          flex
          gap-2
          mb-5
          flex-wrap
        ">

          {[
            "전체",
            "반찬",
            "국&찌개",
            "후식",
            "밥",
            "일품"
          ].map((c) => (

            <button
              key={c}
              onClick={() => {

                setCategory(c);

                setKeyword("");

                setPage(1);
              }}
              className={`category-btn ${
                category === c ? "active" : ""
              }`}
            >
              {c}
            </button>
          ))}
        </div>


        {/* 로딩 */}
        {loading && (
          <p className="mb-4">
            불러오는 중...
          </p>
        )}


        {/* 레시피 리스트 */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          xl:grid-cols-8
          gap-5
        ">

          {recipes.map((recipe) => (

            <RecipeCard
              key={recipe.rcpSeq}
              recipe={recipe}
            />
          ))}
        </div>


        {/* 결과 없을 때 */}
        {!loading && recipes.length === 0 && (

          <div className="
            text-center
            py-20
            text-gray-400
          ">
            검색 결과가 없습니다.
          </div>
        )}


        {/* 페이지네이션 */}
        <div className="
          flex
          justify-center
          items-center
          gap-3
          mt-10
        ">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="
              px-4
              py-2
              border
              rounded-xl
              disabled:opacity-30
            "
          >
            이전
          </button>

          <span className="text-sm">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="
              px-4
              py-2
              border
              rounded-xl
              disabled:opacity-30
            "
          >
            다음
          </button>
        </div>
      </div>

      {openExpire && (
        <ExpireModal
          items={[]}
          onClose={() => setOpenExpire(false)}
        />
      )}
    </div>
  );
}
