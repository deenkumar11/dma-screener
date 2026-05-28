import { useState, useEffect } from "react";
import { fmtPrice, fmt2, fmtVol, timeAgo, fetchStockNews } from "../utils/stock";
import { SECTOR_COLORS } from "../data/indices";
import Sparkline from "./Sparkline";

// Currency label map for display in modal header
const CURRENCY_LABELS = {
  INR: "₹ INR",
  USD: "$ USD",
  GBp: "p GBX",   // pence (LSE quotes most stocks in pence)
  GBP: "£ GBP",
  JPY: "¥ JPY",
  EUR: "€ EUR",
  CHF: "CHF",
  AUD: "A$ AUD",
  CAD: "C$ CAD",
  HKD: "HK$ HKD",
};

function NewsItem({ item }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-3 border-b border-white/5 last:border-0 -mx-5 px-5 rounded transition-colors hover:bg-white/3 group"
    >
      <p className="text-sm font-medium text-[#e8e6e1] leading-snug group-hover:text-brand-red transition-colors">
        {item.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-[#5F5E5A]">{item.publisher}</span>
        {item.time && <span className="text-xs text-[#5F5E5A]">· {timeAgo(item.time)}</span>}
      </div>
      {item.summary && (
        <p className="text-xs text-[#888780] mt-1.5 leading-relaxed line-clamp-2">{item.summary}</p>
      )}
    </a>
  );
}

export default function StockModal({ stock, onClose }) {
  const [news, setNews] = useState(null);
  const currency = stock.currency || "USD";
  const displayTicker = stock.ticker.replace(/\.(NS|L|T|SW|PA|DE|AX|TO)$/, "");
  const isNeg = stock.change < 0;
  const sign = stock.change >= 0 ? "+" : "";
  const sectorCls = SECTOR_COLORS[stock.sector] || "bg-gray-700/40 text-gray-300";
  const barW = Math.min(Math.abs(stock.pctBelow) * 2.5, 100).toFixed(1);

  const exchange = stock.ticker.endsWith(".NS") ? "NSE"
    : stock.ticker.endsWith(".L")  ? "LSE"
    : stock.ticker.endsWith(".T")  ? "TSE"
    : stock.ticker.endsWith(".SW") ? "SIX"
    : stock.ticker.endsWith(".PA") ? "Euronext"
    : stock.ticker.endsWith(".DE") ? "XETRA"
    : stock.ticker.endsWith(".AX") ? "ASX"
    : stock.ticker.endsWith(".TO") ? "TSX"
    : "NYSE/Nasdaq";

  const currencyLabel = CURRENCY_LABELS[currency] || currency;

  useEffect(() => {
    fetchStockNews(stock).then(setNews);
  }, [stock.ticker]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-12"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#141518] border border-white/15 rounded-2xl w-full max-w-lg max-h-[82vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-medium text-[#e8e6e1]">{displayTicker}</h2>
              <span className={`badge ${sectorCls}`}>{stock.sector}</span>
              {/* Currency badge */}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-[#888780] border border-white/10">
                {currencyLabel}
              </span>
            </div>
            <p className="text-sm text-[#888780] mt-0.5">{stock.name} · {exchange}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5F5E5A] hover:text-[#e8e6e1] transition-colors p-1 rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Price row */}
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-3xl font-medium text-[#e8e6e1]">{fmtPrice(stock.price, currency)}</p>
              <p className={`text-sm mt-1 ${isNeg ? "text-red-400" : "text-green-400"}`}>
                {sign}{fmt2(stock.change)}% today
              </p>
            </div>
            <div className="ml-auto pb-1">
              <Sparkline data={stock.sparkline} color={isNeg ? "#E24B4A" : "#639922"} />
              <p className="text-[10px] text-[#5F5E5A] text-right mt-1">30-day price</p>
            </div>
          </div>

          {/* DMA alert box */}
          <div className="bg-brand-red-bg border border-brand-red/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-brand-red-dark leading-relaxed">
              <span className="font-medium">{Math.abs(stock.pctBelow).toFixed(2)}% below 200 DMA</span> — trading
              at {fmtPrice(stock.price, currency)} vs 200-day avg of {fmtPrice(stock.dma200, currency)}.
              The stock is in a technical downtrend.
            </p>
            <div className="mt-3 h-1.5 bg-red-200/30 rounded-full overflow-hidden">
              <div className="h-full bg-brand-red rounded-full" style={{ width: barW + "%" }} />
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              ["200 DMA", fmtPrice(stock.dma200, currency)],
              ["50 DMA",  fmtPrice(stock.dma50,  currency)],
              ["Volume",  fmtVol(stock.volume, currency)],
            ].map(([label, val]) => (
              <div key={label} className="bg-[#0e0f11] rounded-lg px-3 py-2.5 text-center">
                <p className="text-[10px] text-[#5F5E5A] uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-[#e8e6e1] mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Note for LSE GBp stocks */}
          {currency === "GBp" && (
            <p className="text-xs text-[#5F5E5A] mb-4 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
              💡 LSE prices quoted in <strong className="text-[#888780]">pence (GBX)</strong>. Divide by 100 for pounds (£).
            </p>
          )}

          {/* News */}
          <p className="text-xs font-medium text-[#5F5E5A] uppercase tracking-widest mb-3">Latest news</p>

          {news === null ? (
            <div className="flex items-center gap-2 text-sm text-[#888780] py-4">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Fetching headlines…
            </div>
          ) : news.length === 0 ? (
            <p className="text-sm text-[#888780]">
              No recent news.{" "}
              <a href={`https://finance.yahoo.com/quote/${stock.ticker}/news/`}
                target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                View on Yahoo Finance ↗
              </a>
            </p>
          ) : (
            <div>{news.map((item, i) => <NewsItem key={i} item={item} />)}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex justify-between items-center">
          <p className="text-xs text-[#5F5E5A]">Press Esc to close · Prices in {currencyLabel}</p>
          <a href={`https://finance.yahoo.com/quote/${stock.ticker}/news/`}
            target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
            Yahoo Finance ↗
          </a>
        </div>
      </div>
    </div>
  );
}
