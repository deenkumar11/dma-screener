import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import IndexSelector from "./components/IndexSelector";
import StatsRow from "./components/StatsRow";
import FiltersBar from "./components/FiltersBar";
import StockCard from "./components/StockCard";
import StockModal from "./components/StockModal";
import Loader from "./components/Loader";
import { useStockScreener } from "./hooks/useStockScreener";
import { INDICES } from "./data/indices";

export default function App() {
  const { stocks, loading, progress, lastUpdated, load } = useStockScreener();
  const [activeIndex, setActiveIndex] = useState(INDICES[0]);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState("pct");
  const [selected, setSelected] = useState(null);

  // Load stocks whenever active index changes
  useEffect(() => {
    setSector("All");
    setSearch("");
    load(activeIndex.stocks);
  }, [activeIndex.id]);

  const handleIndexChange = (idx) => {
    setActiveIndex(idx);
    setSelected(null);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return stocks
      .filter((s) => {
        const matchQ = !q || s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q);
        const matchS = sector === "All" || s.sector === sector;
        return matchQ && matchS;
      })
      .sort((a, b) => {
        if (sort === "pct") return a.pctBelow - b.pctBelow;
        if (sort === "change") return a.change - b.change;
        if (sort === "price") return a.price - b.price;
        if (sort === "volume") return (b.volume / (b.avgVol || 1)) - (a.volume / (a.avgVol || 1));
        return 0;
      });
  }, [stocks, search, sector, sort]);

  return (
    <div className="min-h-screen bg-[#0e0f11]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-[#e8e6e1] mb-1">
            Global 200 DMA Screener
          </h1>
          <p className="text-sm text-[#888780]">
            Real-time screener across major world indices. Select an index below,
            then click any stock card for analysis and latest news.
          </p>
        </div>

        {/* Index selector buttons */}
        <IndexSelector activeId={activeIndex.id} onChange={handleIndexChange} />

        {/* Stats */}
        <StatsRow
          stocks={stocks}
          loading={loading}
          lastUpdated={lastUpdated}
          totalCount={activeIndex.stocks.length}
          indexLabel={activeIndex.label}
        />

        {/* Filters */}
        <FiltersBar
          search={search} setSearch={setSearch}
          sector={sector} setSector={setSector}
          sort={sort} setSort={setSort}
          onRefresh={() => load(activeIndex.stocks)}
          loading={loading}
          sectors={activeIndex.sectors}
        />

        {/* Stock grid */}
        {loading ? (
          <Loader progress={progress} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#888780]">
            <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No stocks in {activeIndex.label} are below 200 DMA right now</p>
            <p className="text-xs text-[#5F5E5A]">All stocks are trading above their 200-day moving average</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#5F5E5A] mb-3">
              {activeIndex.flag} {activeIndex.label} — {filtered.length} stock{filtered.length !== 1 ? "s" : ""} below 200 DMA
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((s) => (
                <StockCard key={s.ticker} stock={s} onClick={setSelected} />
              ))}
            </div>
          </>
        )}

        <footer className="mt-12 py-5 border-t border-white/5 flex justify-between items-center flex-wrap gap-3">
          <p className="text-xs text-[#5F5E5A]">
            © 2026 200 DMA Screener · Global indices · Data via Yahoo Finance · Educational purposes only
          </p>
          <p className="text-xs text-[#5F5E5A]">Not financial advice · Always do your own research</p>
        </footer>
      </main>

      {selected && <StockModal stock={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
