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

// demo API call with BTC-USD pair
app.get("/api/quotes", (req: Request, res: Response) => {
  fetch(
    `${COINMARKETCAP_API_DOMAIN}/v2/cryptocurrency/quotes/latest?symbol=BTC&convert=USD`,
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
    .then((data) => {
      //Assuming API returns >1 results
      const {
        symbol,
        last_updated,
        quote: {
          USD: { price, volume_24h: volume, percent_change_1h: change },
        },
      } = data.data.BTC[0];
      res.json({ [symbol]: { price, volume, change }, last_updated });
    })
    .catch((error) => console.error("Error:", error));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
