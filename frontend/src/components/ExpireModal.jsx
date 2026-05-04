export default function ExpireModal({ items, onClose }) {
  const urgent = items.filter((i) => i.dday <= 3);
  const warning = items.filter((i) => i.dday > 3 && i.dday <= 7);

  const renderItem = (item) => (
    <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl mb-2">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-gray-400">{item.amount}</p>
      </div>

      <span className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded-full">
        D-{item.dday}
      </span>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto">

        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">유통기한 알림</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* 긴급 */}
        <div className="mb-4">
          <p className="text-red-500 font-semibold mb-2">
            🚨 긴급 (3일 이내)
          </p>
          {urgent.map(renderItem)}
        </div>

        {/* 주의 */}
        <div>
          <p className="text-yellow-500 font-semibold mb-2">
            ⚠️ 주의 (7일 이내)
          </p>
          {warning.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-yellow-50 p-3 rounded-xl mb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-400">{item.amount}</p>
              </div>

              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-500 rounded-full">
                D-{item.dday}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}