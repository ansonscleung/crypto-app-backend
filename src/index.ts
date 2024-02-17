import express, { Request, Response } from "express";
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const COINMARKETCAP_API_DOMAIN = process.env.COINMARKETCAP_API_DOMAIN as string;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY as string;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
