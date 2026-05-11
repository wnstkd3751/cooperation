import { useState } from "react";

export default function CookingModal({
  recipe,
  onClose,
}) {

  const [currentStep, setCurrentStep] =
    useState(0);

  const steps = recipe.steps || [];

  const step = steps[currentStep];

  const isFirst = currentStep === 0;

  const isLast =
    currentStep === steps.length - 1;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        z-[60]
        flex
        justify-center
        items-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-3xl
          rounded-3xl
          overflow-hidden
          relative
        "
      >

        {/* 닫기 */}
        <button
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            z-10
            w-10
            h-10
            rounded-full
            bg-black/40
            text-white
          "
        >
          ✕
        </button>

        {/* 진행바 */}
        <div className="w-full h-2 bg-gray-200">

          <div
            className="
              h-full
              bg-orange-400
              transition-all
            "
            style={{
              width: `${
                ((currentStep + 1) /
                  steps.length) *
                100
              }%`,
            }}
          />

        </div>

        {/* step 이미지 */}
        <div
          className="
            h-[320px]
            bg-gray-100
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >

          {step?.imageUrl ? (
            <img
              src={step.imageUrl}
              alt={`step-${step.stepNumber}`}
              className="
                w-full
                h-full
                object-cover
              "
            />
          ) : (
            <div className="text-gray-400">
              이미지 없음
            </div>
          )}

        </div>

        {/* 내용 */}
        <div className="p-8">

          {/* step 번호 */}
          <div
            className="
              text-orange-400
              font-bold
              text-lg
              mb-3
            "
          >
            STEP {step?.stepNumber}
          </div>

          {/* 설명 */}
          <p
            className="
              text-2xl
              font-bold
              leading-relaxed
              min-h-[120px]
            "
          >
            {step?.description}
          </p>

          {/* 하단 버튼 */}
          <div
            className="
              flex
              justify-between
              mt-10
              gap-4
            "
          >

            <button
              disabled={isFirst}
              onClick={() =>
                setCurrentStep(
                  currentStep - 1
                )
              }
              className="
                flex-1
                border
                rounded-2xl
                py-4
                disabled:opacity-30
              "
            >
              이전
            </button>

            {!isLast ? (

              <button
                onClick={() =>
                  setCurrentStep(
                    currentStep + 1
                  )
                }
                className="
                  flex-1
                  bg-orange-400
                  hover:bg-orange-500
                  text-white
                  rounded-2xl
                  py-4
                  font-bold
                "
              >
                다음
              </button>

            ) : (

              <button
                onClick={onClose}
                className="
                  flex-1
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  rounded-2xl
                  py-4
                  font-bold
                "
              >
                완료
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}