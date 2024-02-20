import express, { Request, Response } from "express";
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const COINMARKETCAP_API_DOMAIN = process.env.COINMARKETCAP_API_DOMAIN as string;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY as string;

const coinMarketCapOptions = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers":
      "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
    "Content-Type": "application/json",
    "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
  },
};

const getQuote = async (symbols: Array<String>, fiats: Array<String>) => {
  const symbolsString = symbols.join(",");
  const fiatsString = fiats.join(",");
  return (
    fetch(
      `${COINMARKETCAP_API_DOMAIN}/v2/cryptocurrency/quotes/latest?symbol=${symbolsString}&convert=${fiatsString}`,
      coinMarketCapOptions
    )
      .then((response) => response.json())
      //TODO: types for CoinMarketCap API results
      .then(({ data }: { data: { [key: string]: any } }) => {
        let result = Object.values(data).map((quote) => {
          // Get first quote if >1 quotes
          const firstQuote = Array.isArray(quote) ? quote[0] : quote;
          const {
            symbol,
            name,
            last_updated,
            quote: {
              USD: { price, volume_24h: volume, percent_change_1h: change },
            },
          } = firstQuote;
          return { symbol, name, price, volume, change, last_updated };
        });
        return result;
      })
      .catch((error) => {
        console.error("Error:", error);
        return null;
      })
  );
};

app.get("/api/quotes", async (req: Request, res: Response) => {
  try {
    // Split Crpyto to call by 5 according to CMC API
    const response1 = await getQuote(
      ["BTC", "ETH", "LTC", "XMR", "XRP"],
      ["USD"]
    );
    const response2 = await getQuote(["DOGE", "DASH", "MAID", "LSK"], ["USD"]);
    const result = response1 && response2 ? response1.concat(response2) : [];
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
