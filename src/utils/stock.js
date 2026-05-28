// ─── Currency formatting ──────────────────────────────────────────────────────

const CURRENCY_CONFIG = {
  INR: { symbol: "₹", locale: "en-IN", decimals: 2 },
  USD: { symbol: "$", locale: "en-US", decimals: 2 },
  GBp: { symbol: "p",  locale: "en-GB", decimals: 2, note: "pence" }, // LSE quotes in pence
  GBP: { symbol: "£", locale: "en-GB", decimals: 2 },
  JPY: { symbol: "¥", locale: "ja-JP", decimals: 0 },  // JPY has no decimals
  EUR: { symbol: "€", locale: "de-DE", decimals: 2 },
  CHF: { symbol: "CHF ", locale: "de-CH", decimals: 2 },
  HKD: { symbol: "HK$", locale: "en-HK", decimals: 2 },
  AUD: { symbol: "A$", locale: "en-AU", decimals: 2 },
  CAD: { symbol: "C$", locale: "en-CA", decimals: 2 },
  SGD: { symbol: "S$", locale: "en-SG", decimals: 2 },
};

// Format a price given a currency code returned by Yahoo Finance
export function fmtPrice(n, currency = "USD") {
  if (n == null) return "—";
  const cfg = CURRENCY_CONFIG[currency] || { symbol: currency + " ", locale: "en-US", decimals: 2 };
  const formatted = Number(n).toLocaleString(cfg.locale, {
    minimumFractionDigits: cfg.decimals,
    maximumFractionDigits: cfg.decimals,
  });
  return cfg.symbol + formatted;
}

// Keep fmtINR as alias for legacy use
export const fmtINR = (n) => fmtPrice(n, "INR");

export const fmt2 = (n) => (n != null ? Number(n).toFixed(2) : "—");

export function fmtVol(n, currency = "USD") {
  if (!n) return "—";
  // Indian stocks: use L/Cr notation
  if (currency === "INR") {
    if (n >= 1e7) return (n / 1e7).toFixed(1) + " Cr";
    if (n >= 1e5) return (n / 1e5).toFixed(1) + "L";
    return n.toLocaleString("en-IN");
  }
  // Japanese stocks: no suffix needed for large numbers in JPY context
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString("en-US");
}

export const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts * 1000) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
};

// ─── Data fetching ────────────────────────────────────────────────────────────

export async function fetchStockData(stock) {
  try {
    const res = await fetch(
      `/api/chart/${encodeURIComponent(stock.ticker)}?interval=1d&range=1y&includePrePost=false`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const r = data.chart.result[0];
    const closes = r.indicators.quote[0].close.filter(Boolean);
    if (closes.length < 30) return null;

    // ✅ Read actual currency from Yahoo Finance response
    const currency = r.meta?.currency || "USD";

    const price = closes[closes.length - 1];
    const prev = closes[closes.length - 2];
    const slice = closes.length >= 200 ? closes.slice(-200) : closes;
    const dma200 = slice.reduce((a, b) => a + b, 0) / slice.length;
    const dma50 = closes.slice(-50).reduce((a, b) => a + b, 0) / Math.min(closes.length, 50);
    const change = ((price - prev) / prev) * 100;
    const pctBelow = ((price - dma200) / dma200) * 100;

    const vols = r.indicators.quote[0].volume || [];
    const volume = vols[vols.length - 1] || 0;
    const avgVol = vols.slice(-20).reduce((a, b) => a + (b || 0), 0) / 20;

    const recentCloses = closes.slice(-30);
    const sparkline = recentCloses.map((c, i) => ({ i, v: c }));

    // currency is stored on each stock object
    return { ...stock, price, prev, change, dma200, dma50, pctBelow, volume, avgVol, sparkline, currency };
  } catch {
    return null;
  }
}

export async function fetchStockNews(stock) {
  try {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(stock.name)}&newsCount=8&quotesCount=0`
    );
    const data = await res.json();
    return (data?.news || []).map((n) => ({
      title: n.title,
      link: n.link,
      publisher: n.publisher,
      time: n.providerPublishTime,
      summary: n.summary || "",
    }));
  } catch {
    return [];
  }
}
