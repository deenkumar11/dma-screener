import { fmtPrice, fmt2, fmtVol } from "../utils/stock";
import { SECTOR_COLORS } from "../data/indices";
import Sparkline from "./Sparkline";

export default function StockCard({ stock, onClick }) {
  const displayTicker = stock.ticker.replace(/\.(NS|L|T|SW|PA|DE|AX|TO)$/, "");
  const currency = stock.currency || "USD";
  const isNeg = stock.change < 0;
  const sign = stock.change >= 0 ? "+" : "";
  const barW = Math.min(Math.abs(stock.pctBelow) * 2.5, 100).toFixed(1);
  const sectorCls = SECTOR_COLORS[stock.sector] || "bg-gray-700/40 text-gray-300";
  const volRatio = stock.avgVol > 0 ? (stock.volume / stock.avgVol).toFixed(1) : "—";

  return (
    <div className="card group" onClick={() => onClick(stock)}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-medium text-[#e8e6e1]">{displayTicker}</span>
            <span className={`badge ${sectorCls}`}>{stock.sector}</span>
          </div>
          <p className="text-xs text-[#888780] mt-0.5 truncate">{stock.name}</p>
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <div className="flex items-center gap-2 justify-end">
            <Sparkline data={stock.sparkline} color={isNeg ? "#E24B4A" : "#639922"} />
            <div>
              <p className="text-[15px] font-medium text-[#e8e6e1]">{fmtPrice(stock.price, currency)}</p>
              <p className={`text-xs mt-0.5 ${isNeg ? "text-red-400" : "text-green-400"}`}>
                {sign}{fmt2(stock.change)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-[#888780] mb-1.5">
          <span>vs 200 DMA ({fmtPrice(stock.dma200, currency)})</span>
          <span className="text-red-400 font-medium">{Math.abs(stock.pctBelow).toFixed(1)}% below</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red rounded-full transition-all duration-700"
            style={{ width: barW + "%" }}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
        {[
          ["50 DMA", fmtPrice(stock.dma50, currency)],
          ["Volume", fmtVol(stock.volume, currency)],
          ["Vol ratio", volRatio + (volRatio !== "—" ? "x" : "")],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-[10px] text-[#5F5E5A] uppercase tracking-wider">{label}</p>
            <p className="text-xs font-medium text-[#e8e6e1] mt-0.5">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
