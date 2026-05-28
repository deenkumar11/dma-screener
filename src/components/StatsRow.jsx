import { fmtINR } from "../utils/stock";

function StatBox({ label, value, sub, accent }) {
  return (
    <div className="stat-box">
      <p className="text-xs text-[#888780] uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-medium ${accent ? "text-brand-red" : "text-[#e8e6e1]"}`}>{value}</p>
      {sub && <p className="text-xs text-[#5F5E5A] mt-1">{sub}</p>}
    </div>
  );
}

export default function StatsRow({ stocks, loading, lastUpdated, totalCount, indexLabel }) {
  const avg =
    stocks.length > 0
      ? (stocks.reduce((a, s) => a + s.pctBelow, 0) / stocks.length).toFixed(1)
      : null;
  const worst = stocks.length > 0 ? stocks[0] : null;
  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <StatBox
        label="Below 200 DMA"
        value={loading ? "…" : stocks.length}
        sub={`of ${totalCount} ${indexLabel} stocks`}
        accent
      />
      <StatBox
        label="Avg % below"
        value={loading ? "…" : avg ? avg + "%" : "—"}
        sub="across screened stocks"
        accent
      />
      <StatBox
        label="Most beaten down"
        value={loading ? "…" : worst ? worst.ticker.replace(/\.(NS|L|T|SW|PA|DE|AX|TO)$/, "") : "—"}
        sub={worst ? Math.abs(worst.pctBelow).toFixed(1) + "% below DMA" : ""}
      />
      <StatBox label="Last refreshed" value={loading ? "Fetching…" : updatedStr} sub="Yahoo Finance data" />
    </div>
  );
}
