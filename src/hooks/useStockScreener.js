import { useState, useCallback } from "react";
import { fetchStockData } from "../utils/stock";

export function useStockScreener() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async (stockList) => {
    if (!stockList || stockList.length === 0) return;
    setLoading(true);
    setStocks([]);
    setProgress(0);

    let done = 0;
    const results = [];

    await Promise.all(
      stockList.map(async (s) => {
        const r = await fetchStockData(s);
        done++;
        setProgress(Math.round((done / stockList.length) * 100));
        if (r && r.pctBelow < 0) results.push(r);
      })
    );

    results.sort((a, b) => a.pctBelow - b.pctBelow);
    setStocks(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  return { stocks, loading, progress, lastUpdated, load };
}
