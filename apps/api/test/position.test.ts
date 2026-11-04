import { describe, expect, it } from "vitest";
import { positionBetween, STEP } from "../src/tickets/position.js";

describe("positionBetween", () => {
  it("starts an empty column at one step", () => {
    expect(positionBetween(null, null)).toBe(STEP);
  });
  it("goes above the first item", () => {
    expect(positionBetween(null, 1024)).toBe(0);
  });
  it("goes after the last item", () => {
    expect(positionBetween(2048, null)).toBe(3072);
  });
  it("uses the midpoint between neighbours", () => {
    expect(positionBetween(1024, 2048)).toBe(1536);
  });
  it("asks for a rebalance when the gap is too small", () => {
    expect(positionBetween(1, 1 + 1e-7)).toBeNull();
  });
});
