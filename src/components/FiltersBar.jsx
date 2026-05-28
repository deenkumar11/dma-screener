const SORTS = [
  { value: "pct", label: "Most % below DMA" },
  { value: "change", label: "Biggest daily drop" },
  { value: "price", label: "Price low → high" },
  { value: "volume", label: "Volume ratio" },
];

export default function FiltersBar({ search, setSearch, sector, setSector, sort, setSort, onRefresh, loading, sectors }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5 items-center">
      <input
        className="input-dark flex-1 min-w-[180px]"
        placeholder="Search ticker or company name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select className="select-dark" value={sector} onChange={(e) => setSector(e.target.value)}>
        {(sectors || ["All"]).map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <select className="select-dark" value={sort} onChange={(e) => setSort(e.target.value)}>
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        className="btn-ghost flex items-center gap-1.5"
        onClick={onRefresh}
        disabled={loading}
      >
        <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {loading ? "Loading…" : "Refresh"}
      </button>
    </div>
  );
}
