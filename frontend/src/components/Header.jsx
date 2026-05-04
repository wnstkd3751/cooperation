// components/Header.jsx
export default function Header({ onOpenExpire }) {
  return (
    <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white p-6 rounded-b-3xl">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">
          <img
            src="/img/profile.png"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm opacity-80">안녕하세요,</p>
            <p className="font-semibold">사용자님</p>
          </div>
        </div>

        <div
          className="relative cursor-pointer"
          onClick={onOpenExpire}
        >
          🔔
          <span className="absolute -top-2 -right-2 bg-red-400 text-xs px-1 rounded-full">
            4
          </span>
        </div>
      </div>
    </div>
  );
}