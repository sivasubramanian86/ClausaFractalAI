import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AnalyticsDashboard } from "../../components/AnalyticsDashboard";
import { en } from "../../i18n/locales/en";

describe("AnalyticsDashboard Unit Test Suite", () => {
  it("renders KPI metrics, risk breakdown, and triggers sync", async () => {
    // Mock global fetch
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/analytics/metrics")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              total_queries: 250,
              total_cached_tokens: 3500000,
              cost_saved_usd: 28.5,
              avg_latency_ms: 280,
              hallucination_rate: 0.0,
              cache_hit_rate_pct: 96.5,
            }),
        });
      }
      if (url.includes("/api/analytics/risks")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                category: "Uncapped Indemnification",
                count: 55,
                severity: "CRITICAL",
                sample_clause: "Customer indemnifies vendor without cap",
              },
            ]),
        });
      }
      return Promise.reject(new Error("Unknown route"));
    });

    (globalThis as any).fetch = mockFetch;

    render(<AnalyticsDashboard t={en} />);

    expect(screen.getByText(en.analyticsTitle)).toBeInTheDocument();
    expect(screen.getByText(/BigQuery Streaming: Active/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("3.50M")).toBeInTheDocument();
      expect(screen.getByText("$28.50")).toBeInTheDocument();
    });

    // Test Sync button — wrap in act because click triggers async fetch → setState
    await act(async () => {
      const syncBtn = screen.getByRole("button", { name: /Sync/i });
      fireEvent.click(syncBtn);
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  it("retains optimistic fallback metrics when fetch throws error", async () => {
    (globalThis as any).fetch = vi.fn().mockRejectedValue(new Error("Telemetry service unavailable"));

    render(<AnalyticsDashboard t={en} />);

    expect(screen.getByText(en.analyticsTitle)).toBeInTheDocument();
    // Default optimistic metrics should be displayed
    await waitFor(() => {
      expect(screen.getByText(/94\.2%/i)).toBeInTheDocument();
    });
  });
});
