export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-6">
        개인정보 처리방침
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">

        <p>
          본 서비스는 회원가입 및 로그인
          기능을 제공하기 위해
          아이디, 이메일 정보를 수집합니다.
        </p>

        <p>
          수집된 정보는 서비스 제공
          목적 외에는 사용되지 않습니다.
        </p>

        <p>
          사용자는 언제든지 회원탈퇴를 통해
          개인정보 삭제를 요청할 수 있습니다.
        </p>

      </div>
    </div>
  );
}