/**
 * Unit tests for NeuroSymbolicTraceVisualizer Component.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { NeuroSymbolicTraceVisualizer } from "../../components/NeuroSymbolicTraceVisualizer";
import * as apiModule from "../../lib/api";

describe("NeuroSymbolicTraceVisualizer Unit Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading and allows triggering formal verification", async () => {
    vi.spyOn(apiModule.api, "analyzeClause").mockResolvedValueOnce({
      trace_id: "00-testtrace-testspan-01",
      cached: false,
      result: {
        status: "PROVEN_AND_SYNTHESIZED",
        plan: {
          plan_id: "plan_test_01",
          intent: "Test intent",
          proposed_action: "Test action",
          risk_category: "Indemnification",
          proposed_liability_cap_usd: 500000,
          proposed_notice_days: 30,
          require_mutual_indemnity: true,
          forbid_consequential_waiver: true,
          confidence: 0.98,
        },
        verification: {
          is_satisfiable: true,
          status: "SAT",
          unsat_core: [],
          model_assignments: {},
          diagnostics: "Proven SAT",
        },
        synthesis: {
          counter_clause: "Mutual indemnity clause text",
          negotiation_rationale: "Bilateral fairness",
          suggested_questions: ["Q1?"],
        },
        delegation_depth: 3,
        delegation_stack: ["Supervisor", "TriageAgent", "ReasoningAgent"],
      },
    });

    render(<NeuroSymbolicTraceVisualizer />);

    expect(screen.getByText("Dual-Pass Neuro-Symbolic Agent Mesh")).toBeInTheDocument();
    expect(screen.getByText("Z3 Theorem Prover: SAT Ready")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Run Formal Verification/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Neural Perception")).toBeInTheDocument();
      expect(screen.getByText("Symbolic Proof")).toBeInTheDocument();
      expect(screen.getByText("Reasoning Synthesis")).toBeInTheDocument();
      expect(screen.getByText(/00-testtrace-testspan-01/i)).toBeInTheDocument();
    });
  });

  it("handles error during verification gracefully", async () => {
    vi.spyOn(apiModule.api, "analyzeClause").mockRejectedValueOnce(
      new Error("Z3 Solver timeout")
    );

    render(<NeuroSymbolicTraceVisualizer />);

    const button = screen.getByRole("button", { name: /Run Formal Verification/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Z3 Solver timeout")).toBeInTheDocument();
    });
  });
});
