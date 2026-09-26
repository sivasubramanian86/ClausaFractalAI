import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  logger,
  getCurrentTraceId,
  resetActiveTraceId,
  getW3CTraceparent,
} from "../../lib/logger";

describe("FrontendLogger Unit Tests", () => {
  beforeEach(() => {
    logger.clearLogs();
    resetActiveTraceId();
  });

  it("generates valid W3C traceparent headers and trace IDs", () => {
    const tid = getCurrentTraceId();
    expect(tid).toHaveLength(32);

    const tp = getW3CTraceparent();
    expect(tp).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);

    const newTid = resetActiveTraceId();
    expect(newTid).toHaveLength(32);
    expect(newTid).not.toEqual(tid);
  });

  it("logs debug, info, warn, and error entries with structured metadata", () => {
    const consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const d = logger.debug("TestComponent", "Debug message", { key: "val" });
    expect(d.level).toBe("DEBUG");
    expect(d.message).toBe("Debug message");
    expect(d.component).toBe("TestComponent");

    const dNoData = logger.debug("TestComponent", "Debug without data");
    expect(dNoData.level).toBe("DEBUG");

    const i = logger.info("TestComponent", "Info message");
    expect(i.level).toBe("INFO");

    const iWithData = logger.info("TestComponent", "Info with data", { infoKey: 42 });
    expect(iWithData.level).toBe("INFO");

    const w = logger.warn("TestComponent", "Warn message");
    expect(w.level).toBe("WARN");

    const wWithData = logger.warn("TestComponent", "Warn with data", { warnKey: "active" });
    expect(wWithData.level).toBe("WARN");

    const testErr = new Error("Sample breakdown");
    const e = logger.error("TestComponent", "Error message", testErr, { extra: 123 });
    expect(e.level).toBe("ERROR");
    expect(e.error?.name).toBe("Error");
    expect(e.error?.message).toBe("Sample breakdown");
    expect(e.error?.stack).toBeDefined();

    // Error with data only and no error object
    const eDataOnly = logger.error("TestComponent", "Error without err object", undefined, { extra: 456 });
    expect(eDataOnly.level).toBe("ERROR");

    // Error with neither error object nor data
    const eNeither = logger.error("TestComponent", "Error with neither");
    expect(eNeither.level).toBe("ERROR");

    // Plain object error
    const objErr = logger.error("TestComponent", "Obj error message", { code: 500 });
    expect(objErr.error?.name).toBe("UnknownError");

    const logs = logger.getLogs();
    expect(logs.length).toBe(10);

    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("handles log buffer clearing", () => {
    logger.info("Comp", "msg 1");
    expect(logger.getLogs().length).toBe(1);
    logger.clearLogs();
    expect(logger.getLogs().length).toBe(0);
  });

  it("caps in-memory log buffer at maxLogs and drops oldest entries", () => {
    for (let i = 0; i < 505; i++) {
      logger.info("Comp", `msg ${i}`);
    }
    expect(logger.getLogs().length).toBe(500);
  });
});
