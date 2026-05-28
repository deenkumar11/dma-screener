export default async function handler(req, res) {
  const { ticker } = req.query;

  // Forward all query params (interval, range, etc.)
  const params = new URLSearchParams(req.query);
  params.delete("ticker"); // remove the path param itself

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://finance.yahoo.com/",
      },
    });

    const data = await response.json();

    // Set CORS + cache headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600"); // cache 5 min
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Yahoo Finance", detail: err.message });
  }
}
