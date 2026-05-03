// components/ExpireModal.jsx
export default function ExpireModal({ items, onClose }) {
  const urgent = items.filter((i) => i.dday <= 3);

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2 className="font-bold text-lg">유통기한 임박</h2>

        {urgent.map((i) => (
          <div key={i.id} className="flex justify-between mt-3 text-sm">
            <span>{i.name}</span>
            <span className="text-red-500 font-semibold">
              D-{i.dday}
            </span>
          </div>
        ))}

        <button onClick={onClose} className="btn-primary w-full mt-4">
          닫기
        </button>

      </div>
    </div>
  );
}