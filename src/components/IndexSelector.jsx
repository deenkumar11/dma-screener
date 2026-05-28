import { INDICES } from "../data/indices";

export default function IndexSelector({ activeId, onChange }) {
  return (
    <div className="mb-6">
      <p className="text-xs text-[#5F5E5A] uppercase tracking-widest mb-3 font-medium">
        Select Index
      </p>
      <div className="flex flex-wrap gap-2">
        {INDICES.map((idx) => {
          const isActive = activeId === idx.id;
          return (
            <button
              key={idx.id}
              onClick={() => onChange(idx)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                border transition-all duration-150
                ${isActive
                  ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
                  : "bg-[#141518] border-white/10 text-[#888780] hover:border-white/25 hover:text-[#e8e6e1]"
                }
              `}
            >
              <span className="text-base leading-none">{idx.flag}</span>
              <span>{idx.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-[#5F5E5A]"
                }`}
              >
                {idx.region}
              </span>
            </button>
          );
        })}
      </div>
      {INDICES.find((i) => i.id === activeId) && (
        <p className="text-xs text-[#5F5E5A] mt-2">
          {INDICES.find((i) => i.id === activeId).description}
        </p>
      )}
    </div>
  );
}
