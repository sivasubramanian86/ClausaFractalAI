import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NeuroSymbolicApiClient, generateW3CTraceparent } from "../../lib/api";

describe("NeuroSymbolicApiClient Unit Tests", () => {
  const client = new NeuroSymbolicApiClient("http://localhost:8000");

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generateW3CTraceparent formats standard W3C header", () => {
    const trace = generateW3CTraceparent();
    expect(trace.traceId).toHaveLength(32);
    expect(trace.spanId).toHaveLength(16);
    expect(trace.traceparent).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
  });

  it("analyzeClause succeeds on valid response", async () => {
    const mockPayload = {
      trace_id: "test_trace_123",
      cached: false,
      result: { status: "PROVEN" },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPayload,
    } as Response);

    const res = await client.analyzeClause("Vendor shall indemnify Customer");
    expect(res.trace_id).toBe("test_trace_123");
    expect(res.result.status).toBe("PROVEN");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/v2/analyze",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          traceparent: expect.stringMatching(/^00-/),
        }),
      })
    );
  });

  it("analyzeClause throws on HTTP failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(client.analyzeClause("Bad clause")).rejects.toThrow(
      "API analysis failed with status 500"
    );
  });

  it("listMCPTools succeeds on valid response", async () => {
    const mockTools = [{ name: "formal_verify", description: "Z3", required_capability: "z3" }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    } as Response);

    const res = await client.listMCPTools();
    expect(res).toEqual(mockTools);
  });

  it("listMCPTools throws on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);

    await expect(client.listMCPTools()).rejects.toThrow("Failed to list MCP tools: 403");
  });

  it("listHITLTickets succeeds on valid response", async () => {
    const mockTickets = [{ checkpoint_id: "chk_1" }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTickets,
    } as Response);

    const res = await client.listHITLTickets();
    expect(res).toEqual(mockTickets);
  });

  it("listHITLTickets throws on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
    } as Response);

    await expect(client.listHITLTickets()).rejects.toThrow("Failed to fetch HITL tickets: 502");
  });
});
