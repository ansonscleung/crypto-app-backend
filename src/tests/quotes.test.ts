import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import server from "../index";

require("dotenv").config();

afterEach(async () => {
  await server.close();
});

describe("GET /api/quotes", () => {
  it("should return all quotes", async () => {
    const res = await request(server).get("/api/quotes");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
