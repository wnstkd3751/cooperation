import { create } from "zustand";

export const useRecommendStore = create(
  (set) => ({

    recommendedRecipes: [],

    setRecommendedRecipes: (
      recipes
    ) =>
      set({
        recommendedRecipes: recipes,
      }),

    clearRecommendedRecipes: () =>
      set({
        recommendedRecipes: [],
      }),

  })
);