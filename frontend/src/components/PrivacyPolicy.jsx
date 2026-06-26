import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/Header";
import privacyPolicyContent from "../content/PrivacyPolicy.md?raw";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">개인정보 처리방침</h1>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
        >
          ← 돌아가기
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 prose-h3:mt-5 prose-h3:mb-2 prose-table:text-sm prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border prose-th:border prose-td:border-gray-200 prose-th:border-gray-200 prose-hr:my-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {privacyPolicyContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}