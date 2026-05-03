// src/store/useFridgeStore.js
import { create } from "zustand";
import { fridgeItems } from "../mock/data";

export const useFridgeStore = create((set) => ({
  items: fridgeItems,
  category: "전체",

  setCategory: (cat) => set({ category: cat }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
}));