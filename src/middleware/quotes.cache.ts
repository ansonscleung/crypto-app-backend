import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";
require("dotenv").config();

// Default cache is 60s unless set in .env
const QUOTES_CACHE_TTL = parseInt(process.env.QUOTES_CACHE_TTL as string) | 60;
export const quotesCache = new NodeCache({ stdTTL: QUOTES_CACHE_TTL });

export const quotesCacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (quotesCache.has("quotes")) {
      return res.json(quotesCache.get("quotes")).status(200);
    }
    return next();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
