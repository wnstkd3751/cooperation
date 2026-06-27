import { useEffect, useRef, useState } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useRecommendStore }
from "../store/recommendStore";

import RecipeDetailModal
from "./RecipeDetailModal";

import RecipeCard
from "./RecipeCard";

import { useChatStore }
from "../store/chatStore";

// 챗봇 답변 마크다운 렌더링 스타일
const mdComponents = {
  h1: (props) => (
    <h3 className="text-lg font-bold mb-2" {...props} />
  ),
  h2: (props) => (
    <h3 className="text-lg font-bold mb-2" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-lg font-bold mb-2" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  p: (props) => (
    <p className="my-1 leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-5 my-1 space-y-1" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-5 my-1 space-y-1" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="
        border-l-4
        border-orange-300
        bg-orange-50/70
        rounded-r-xl
        px-4
        py-2
        my-2
        text-sm
        text-gray-700
      "
      {...props}
    />
  ),
};

export default function ChatBot({
  onClose,
}) {

  const [selectedRecipe, setSelectedRecipe] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const messages =
  useChatStore(
    (state) => state.messages
  );

const setMessages =
  useChatStore(
    (state) => state.setMessages
  );

const addMessage =
  useChatStore(
    (state) => state.addMessage
  );

  const scrollRef = useRef(null);

  const BASE_URL =
    import.meta.env.VITE_BASE_URL;

  const recommendedRecipes =
    useRecommendStore(
      (state) =>
        state.recommendedRecipes
    );

  useEffect(() => {

    if (scrollRef.current) {

      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;

    }

  }, [messages]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    addMessage(userMessage);

    const currentMessage = message;

    const userId =
      localStorage.getItem("user_id");

    const token =
      localStorage.getItem("access_token");

    setMessage("");

    try {

const res = await axios.post(
        BASE_URL + "/recommend/chat",
        {
          user_message:
            currentMessage,

          user_id: userId,

          recipes:
            recommendedRecipes,

          conversation_history:
            updatedMessages.map(
              (msg) => ({
                role: msg.role,
                content: msg.content,
              })
            ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addMessage({
  role: "assistant",
  content:
    res.data.answer,
  recipes:
    res.data
      .recommended_recipes || [],
});

    } catch (e) {

      console.error(e);

      addMessage({
  role: "assistant",
  content:
    "오류가 발생했습니다 😢",
});

    }

  };

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-[95%]
          max-w-2xl
          h-[90vh]
          bg-white
          rounded-[32px]
          overflow-hidden
          shadow-2xl
          flex
          flex-col
        "
      >

        {/* 헤더 */}
        <div
          className="
            bg-gradient-to-r
            from-orange-400
            to-red-400
            px-6
            py-5
            text-white
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2 className="text-2xl font-bold">
              AI 요리 도우미
            </h2>

            <p className="text-sm text-white/80 mt-1">
              냉장고 재료 기반 레시피 추천
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-full
              bg-white/20
              hover:bg-white/30
              transition
              text-xl
            "
          >
            ✕
          </button>

        </div>

        {/* 채팅 영역 */}
        <div
          ref={scrollRef}
          className="
            flex-1
            overflow-y-auto
            px-5
            py-6
            bg-gradient-to-b
            from-orange-50
            to-white
            space-y-6
          "
        >

          {messages.map((msg, idx) => {

            const contentParts =
              msg.content
                .split("---")
                .filter(Boolean);

            return (

              <div
                key={idx}
                className={`
                  flex
                  flex-col
                  gap-4
                  ${
                    msg.role === "user"
                      ? "items-end"
                      : "items-start"
                  }
                `}
              >

                {contentParts.map(
                  (part, partIdx) => {

                    const recipe =
                      partIdx > 0
                        ? msg.recipes?.[partIdx - 1]
                        : null;

                    return (

                      <div
                        key={partIdx}
                        className="w-full"
                      >

                        {/* 메시지 */}
                        <div
                          className={`
                            px-5
                            py-4
                            rounded-3xl
                            whitespace-pre-wrap
                            leading-relaxed
                            shadow-sm
                            ${
                              msg.role === "user"
                                ? `
                                  bg-gradient-to-r
                                  from-red-400
                                  to-orange-400
                                  text-white
                                  ml-auto
                                  max-w-[75%]
                                `
                                : `
                                  bg-white
                                  border
                                  border-orange-100
                                  text-black
                                  max-w-[85%]
                                `
                            }
                          `}
                        >
                          {msg.role === "assistant" ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={mdComponents}
                            >
                              {part.trim()}
                            </ReactMarkdown>
                          ) : (
                            part.trim()
                          )}
                        </div>

                        {/* 레시피 카드 */}
                        {msg.role ===
                          "assistant" &&
                          recipe && (

                          <div
                            className="
                              mt-4
                              w-full
                              text-black
                              max-w-[85%]
                            "
                          >

                            <RecipeCard
                              recipe={recipe}
                              onClick={() => {

                                setSelectedRecipe(
                                  recipe
                                );

                              }}
                            />

                          </div>

                        )}

                      </div>

                    );

                  }
                )}

              </div>

            );

          })}

        </div>

        {/* 입력창 */}
        <div
          className="
            p-4
            border-t
            bg-white
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              bg-gray-100
              rounded-2xl
              p-2
            "
          >

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {
                  sendMessage();
                }

              }}
              placeholder="예: 김치로 만들 수 있는 요리 추천해줘"
              className="
                flex-1
                bg-transparent
                outline-none
                px-3
                py-2
                text-black
              "
            />

            <button
              onClick={sendMessage}
              className="
                bg-gradient-to-r
                from-orange-400
                to-red-400
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
                hover:scale-105
                transition
              "
            >
              전송
            </button>

          </div>

        </div>

      </div>

      {/* 상세 모달 */}
      {selectedRecipe && (

        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() =>
            setSelectedRecipe(null)
          }
          onStartCooking={(
            recipe
          ) => {

            console.log(
              "요리 시작:",
              recipe
            );

          }}
        />

      )}

    </div>

  );

}