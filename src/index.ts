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

// demo API call with BTC/ETH/LTC-USD pairs
app.get("/api/quotes", (req: Request, res: Response) => {
  fetch(
    `${COINMARKETCAP_API_DOMAIN}/v2/cryptocurrency/quotes/latest?symbol=btc,eth,ltc&convert=USD`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers":
          "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
        "Content-Type": "application/json",
        "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
      },
    }
  )
    .then((response) => response.json())
    //TODO: types for CoinMarketCap API results
    .then(({ data }: { data: { [key: string]: any } }) => {
      //Assuming API returns >1 results
      let result = Object.values(data).map((c) => {
        const {
          symbol,
          name,
          last_updated,
          quote: {
            USD: { price, volume_24h: volume, percent_change_1h: change },
          },
        } = c[0];
        return { symbol, name, price, volume, change, last_updated };
      });
      res.json(result);
    })
    .catch((error) => console.error("Error:", error));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
