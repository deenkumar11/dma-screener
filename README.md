# 200 DMA Screener

A free, real-time stock screener for Indian markets (Nifty 50) that identifies stocks trading below their 200-day moving average — with live prices, DMA gap analysis, sparkline charts, and the latest news per stock.

**Completely free. No API keys. No login. No cost.**

---

## Features

- Live 200 DMA filter — fetches 1 year of daily prices, calculates 200-day SMA in real time
- Sparkline charts — 30-day price trend on every card
- News per stock — click any card to pull latest headlines from Yahoo Finance
- Sector filter — Banking, IT, Auto, Pharma, FMCG, Metal, Energy, Infra, Telecom
- Smart sorting — by % below DMA, daily change, price, or volume ratio
- Progress loader — shows % fetched as all 40 stocks load in parallel
- Dark sleek UI — React 18 + Tailwind CSS v3

---

## Tech Stack

| Layer     | Choice                          |
|-----------|---------------------------------|
| Framework | React 18 (Vite)                 |
| Styling   | Tailwind CSS v3                 |
| Data      | Yahoo Finance public API (free) |
| Deploy    | Vercel / Netlify (free tier)    |

---

## Project Structure

```
dma-screener/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatsRow.jsx
│   │   ├── FiltersBar.jsx
│   │   ├── StockCard.jsx
│   │   ├── StockModal.jsx
│   │   ├── Sparkline.jsx
│   │   └── Loader.jsx
│   ├── data/
│   │   └── stocks.js           # Nifty 50 universe + sector colours
│   ├── hooks/
│   │   └── useStockScreener.js # Data fetching hook
│   ├── utils/
│   │   └── stock.js            # Yahoo Finance API + formatters
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Getting Started

```bash
# Install
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

---

## Deploy for Free

### Vercel
1. Push to GitHub
2. vercel.com → Import → Deploy (done in ~60s)

### Netlify
1. Push to GitHub
2. app.netlify.com → New site → Build: `npm run build` → Publish: `dist`

---

## Adding More Stocks

Edit `src/data/stocks.js`:
```js
{ ticker: "ADANIENT.NS", name: "Adani Enterprises", sector: "Infra" },
```
Any `.NS` suffix = NSE stock on Yahoo Finance.

---

## Disclaimer

For educational purposes only. Not financial advice.

## License

MIT
