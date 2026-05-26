import { create } from "zustand";

export const useChatStore =
  create((set) => ({

    messages: [
      {
        role: "assistant",
        content:
          "안녕하세요 👨‍🍳\n오늘은 어떤 요리를 추천받고 싶으신가요?",
      },
    ],

    setMessages: (messages) =>
      set({ messages }),

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    clearMessages: () =>
      set({
        messages: [
          {
            role: "assistant",
            content:
              "안녕하세요 👨‍🍳\n오늘은 어떤 요리를 추천받고 싶으신가요?",
          },
        ],
      }),

  }));