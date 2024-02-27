import express, { Request, Response } from "express";
import { quotesCacheMiddleware } from "./middleware/quotes.cache";
import { quotesController } from "./controllers/quotes.controllers";
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

app.get("/api/quotes", quotesCacheMiddleware, quotesController);

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
