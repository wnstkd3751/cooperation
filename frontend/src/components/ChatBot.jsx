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
          "안녕하세요? 무엇을 도와드릴까요?",
      },
    ]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  setMessages(updatedMessages);

  const currentMessage = message;

  setMessage("");

  try {

    const res = await axios.post(
      BASE_URL + "/recommend/chat",
      {
        user_message: currentMessage,

        ingredients: [],

        conversation_history:
          updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.data.answer,
      },
    ]);

  } catch (e) {

    console.error(e);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "오류가 발생했습니다 😢",
      },
    ]);

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
        bg-black/40
      "
    >

      <div
        className="
          w-[90%]
          max-w-md
          h-[600px]
          bg-white
          rounded-3xl
          shadow-2xl
          flex
          flex-col
          overflow-hidden
          text-black
        "
      >

        <div
          className="
            p-4
            border-b
            flex
            justify-between
            items-center
            
          "
        >

          <div className="font-bold text-lg">
            AI 요리 도우미
          </div>

          <button
            onClick={onClose}
            className="
              text-gray-400
              hover:text-black
              text-xl
            "
          >
            ✕
          </button>

        </div>

        {/* 메시지 */}
        <div
          className="
            flex-1
            overflow-y-auto
            p-4
            bg-gray-50
          "
        >

          {messages.map((msg, idx) => (

            <div
              key={idx}
              className={`
                mb-3
                flex
                ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }
              `}
            >

              <div
                className={`
                  px-4
                  py-3
                  rounded-2xl
                  max-w-[80%]
                  whitespace-pre-wrap
                  ${
                    msg.role === "user"
                      ? "bg-red-400 text-white"
                      : "bg-gray-300 border"
                  }
                `}
              >
                {msg.content}
              </div>

            </div>

          ))}

        </div>

        {/* 입력창 */}
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
            placeholder="질문을 입력하세요"
            className="
              flex-1
              border
              rounded-xl
              px-4
              py-2
              outline-none
            "
          />

          <button
            onClick={sendMessage}
            className="
              bg-red-400
              text-white
              px-5
              rounded-xl
            "
          >
            전송
          </button>

        </div>

      </div>

    </div>

  );
}