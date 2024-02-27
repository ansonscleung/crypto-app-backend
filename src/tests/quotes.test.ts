import {
  jest,
  describe,
  expect,
  it,
  afterEach,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import server from "../index";
import { getQuote, quotesController } from "../controllers/quotes.controllers";
import { createRequest, createResponse } from "node-mocks-http";
import { Server } from "http";

require("dotenv").config();

const unmockedFetch = global.fetch;

afterEach(async () => {
  global.fetch = unmockedFetch;
  await server.close();
});

const MOCK_RES = {
  data: {
    BTC: {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      slug: "bitcoin",
      is_active: 1,
      is_fiat: 0,
      circulating_supply: 17199862,
      total_supply: 17199862,
      max_supply: 21000000,
      date_added: "2013-04-28T00:00:00.000Z",
      num_market_pairs: 331,
      cmc_rank: 1,
      last_updated: "2018-08-09T21:56:28.000Z",
      tags: ["mineable"],
      platform: null,
      self_reported_circulating_supply: null,
      self_reported_market_cap: null,
      quote: {
        USD: {
          price: 6602.60701122,
          volume_24h: 4314444687.5194,
          volume_change_24h: -0.152774,
          percent_change_1h: 0.988615,
          percent_change_24h: 4.37185,
          percent_change_7d: -12.1352,
          percent_change_30d: -12.1352,
          market_cap: 852164659250.2758,
          market_cap_dominance: 51,
          fully_diluted_market_cap: 952835089431.14,
          last_updated: "2018-08-09T21:56:28.000Z",
        },
      },
    },
  },
  status: {
    timestamp: "2024-02-21T01:01:26.248Z",
    error_code: 0,
    error_message: "",
    elapsed: 10,
    credit_count: 1,
    notice: "",
  },
};

const MOCK_400_RES = {
  status: {
    timestamp: "2018-06-02T22:51:28.209Z",
    error_code: 500,
    error_message: "An internal server error occurred",
    elapsed: 10,
    credit_count: 0,
  },
};

describe("Express.js port", () => {
  const ORIGINAL_ENVS = process.env;
  let testServer: Server;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENVS };
  });

  afterEach(async () => {
    process.env = ORIGINAL_ENVS;
    await testServer.close();
  });

  it.each([
    {
      testCase: "listen on any port if specified",
      port: "5001",
      expected: "Server is running on port 5001",
    },
    {
      testCase: "listen on port 5000 if not specified",
      port: undefined,
      expected: "Server is running on port 5000",
    },
  ])("$testCase", async ({ testCase, port, expected }) => {
    process.env.PORT = port;
    const consoleLogSpyOn = jest.spyOn(console, "log");

    // Import the server inside each test case after setting the PORT
    jest.isolateModules(() => {
      testServer = require("../index").server;
    });

    const res = await request(testServer).get("/api/quotes");
    expect(process.env.PORT).toBe(port);
    expect(res.statusCode).toBe(200);
    expect(consoleLogSpyOn).toBeCalledWith(expected);
    await testServer.close();
  });
});

describe("GET /api/quotes", () => {
  it("should return all quotes", () => {
    return request(server)
      .get("/api/quotes")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });
  it("should cache response", async () => {
    let res1 = await request(server).get("/api/quotes");
    let res2 = await request(server).get("/api/quotes");
    return expect(res2.body).toMatchObject(res1.body);
  });
});

describe("quotesController", () => {
  it("should return 9 quotes", async () => {
    let req = createRequest();
    let res = createResponse();
    await quotesController(req, res);
    return expect(res._getJSONData()).toHaveLength(9);
  });
});

describe("getQuote", () => {
  it("should return all quotes if API call normal", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(MOCK_RES)))
    );
    return getQuote(["BTC"], ["USD"]).then((result) => {
      expect(result).toHaveLength(1);
      expect(result![0]).toHaveProperty("name", "Bitcoin");
      expect(result![0]).toHaveProperty("symbol", "BTC");
      expect(result![0]).toHaveProperty("price", 6602.60701122);
      expect(result![0]).toHaveProperty("volume", 4314444687.5194);
      expect(result![0]).toHaveProperty("change", 0.988615);
      expect(result![0]).toHaveProperty(
        "last_updated",
        "2018-08-09T21:56:28.000Z"
      );
    });
  });
  it("should return empty value if API returns empty", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify("")))
    );
    return getQuote(["BTC"], ["USD"]).then((result) => {
      expect(result).toBe(null);
    });
  });
  it("should return empty value if API returns 400", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(MOCK_400_RES), {
          status: 500,
          statusText: "An internal server error occurred",
        })
      )
    );
    return getQuote(["BTC"], ["USD"]).then((result) => {
      expect(result).toBe(null);
    });
  });
});
