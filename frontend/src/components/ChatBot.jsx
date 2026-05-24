import { useState } from "react";
import axios from "axios";

export default function ChatBot({
  onClose,
}) {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "안녕하세요 👨‍🍳 무엇을 도와드릴까요?"
      }
    ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    const currentMessage = message;

    setMessage("");

    try {

      const res = await axios.post(
        "http://localhost:8000/ai/chat",
        {
          message: currentMessage
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer
        }
      ]);

    } catch (e) {

      console.error(e);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
          "오늘 저녁으로는 훈제오리가슴살 샐러드를 추천드려요"
            // "에러가 발생했습니다 😢"
        }
      ]);

    }

  };

  return (

    <div
  className="
    fixed
    inset-0
    bg-black/40
    z-50
    flex
    justify-center
    items-center
  "
>

      {/* 채팅창 */}
      <div
        className="
          w-full
          max-w-md
          h-[600px]
          bg-white
          shadow-2xl
          flex
          flex-col
          text-black
        "
      >

        {/* 헤더 */}
        <div
          className="
            p-4
            border-b
            font-bold
            flex
            justify-between
            items-center
          "
        >

          <div>
            AI 요리 도우미
          </div>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✖
          </button>

        </div>

        {/* 메시지 */}
        <div
          className="
            flex-1
            overflow-y-auto
            p-3
          "
        >

          {messages.map((msg, idx) => (

            <div
              key={idx}
              className={`
                mb-3
                ${msg.role === "user"
                  ? "text-right"
                  : "text-left"}
              `}
            >

              <div
                className={`
                  inline-block
                  px-3
                  py-2
                  rounded-xl
                  max-w-[80%]
                  whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-red-400 text-white"
                    : "bg-gray-100"}
                `}
              >
                {msg.content}
              </div>

            </div>

          ))}

        </div>

        {/* 입력 */}
        <div
          className="
            p-3
            border-t
            flex
            gap-2
          "
        >

          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                sendMessage();
              }

            }}
            className="
              flex-1
              border
              rounded-lg
              px-3
              py-2
            "
            placeholder="메시지를 입력하세요"
          />

          <button
            onClick={sendMessage}
            className="
              bg-red-400
              text-white
              px-4
              rounded-lg
            "
          >
            전송
          </button>

        </div>

      </div>

    </div>

  );
}