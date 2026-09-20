import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "../../App";

describe("StudioWorkflow Integration Test Suite", () => {
  it("executes full legal studio workflow: upload, audio, Q&A, blindspots, diff, prep, rewrite", async () => {
    // Mock global fetch for API endpoints
    const mockFetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/documents/upload")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              document_id: "doc_upload_test",
              filename: "Uploaded_Vendor_Agreement.pdf",
              pages: [
                { page_number: 1, clean_text: "Clean text for uploaded page 1" },
                { page_number: 2, clean_text: "Clean text for uploaded page 2 with liability cap" },
              ],
            }),
        });
      }
      if (url.includes("/api/audio/transcribe")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              transcript: "What is the liability cap under Section 4?",
              detected_language: "en",
              confidence: 0.98,
            }),
        });
      }
      if (url.includes("/api/chat")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              answer: "The liability is capped at $50,000 trailing fees.",
              intent: "LEGAL_QA",
              quality_score: 9.8,
              citations: [{ clause: "Limitation of Liability", page: 2, snippet: "capped at $50,000" }],
            }),
        });
      }
      if (url.includes("/api/blindspots")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              document_id: "doc_test_123",
              template_name: "saas_sla",
              compliance_score: 82.5,
              critical_count: 1,
              present_clauses: ["data_security"],
              omitted_findings: [
                {
                  clause_key: "liability_carveout",
                  severity: "CRITICAL",
                  title: "Missing Gross Negligence Carve-out",
                  risk_description: "Unlimited liability exposure detected",
                  suggested_clause: "Add bilateral cap and carve-out gross negligence.",
                },
              ],
            }),
        });
      }
      if (url.includes("/api/diff")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              doc_a_id: "doc_test_123",
              doc_b_id: "doc_b_amendment",
              total_shifts_detected: 1,
              impact_matrix: [
                {
                  clause_topic: "Limitation of Liability",
                  previous_term: "Mutual $50,000 Cap",
                  new_term: "One-sided Customer uncapped",
                  impact_type: "RIGHTS_SURRENDERED",
                  plain_english_takeaway: "Customer bears all litigation overhead",
                  risk_level: "HIGH",
                },
              ],
              overall_verdict: "CAUTION: Unfavorable shift of core liability rights",
            }),
        });
      }
      if (url.includes("/api/copilot/attorney-prep")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              document_id: "doc_test_123",
              executive_summary: "High risk profile due to uncapped indemnities.",
              critical_red_flags: ["Unlimited liability exposure"],
              attorney_questions: [
                {
                  category: "Liability",
                  question: "Will vendor agree to trailing 12-month cap?",
                  context_rationale: "Mitigates catastrophic breach risk",
                },
              ],
              negotiation_leverage_points: ["High annual contract value creates strong leverage"],
            }),
        });
      }
      if (url.includes("/api/copilot/rewrite-clause")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              original_clause: "Customer indemnifies vendor without aggregate cap.",
              counter_clause: "Each party's indemnification obligation shall not exceed aggregate fees paid in prior 12 months.",
              strategic_rationale: "Establishes standard commercial reciprocity.",
              negotiation_tip: "Frame as corporate governance requirement for procurement signoff.",
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "OK" }),
      });
    });

    (globalThis as any).fetch = mockFetch;

    render(<App />);

    // 1. Test Document File Upload trigger
    const file = new File(["dummy contract content"], "test_contract.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText(/Upload Contract PDF or Text File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/documents/upload", expect.any(Object));
    });

    // 2. Test Audio Dictation trigger
    const audioFile = new File(["audio-bytes"], "voice_query.wav", { type: "audio/wav" });
    const audioInput = screen.getByLabelText(/Upload audio voice dictation/i);
    fireEvent.change(audioInput, { target: { files: [audioFile] } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/audio/transcribe", expect.any(Object));
    });

    // 3. Test Question Sending in Verifiable Chat
    const chatInput = screen.getByLabelText(/Ask a legal question/i);
    fireEvent.change(chatInput, { target: { value: "What is the liability cap?" } });
    const sendBtn = screen.getByRole("button", { name: /Send Question/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/chat", expect.any(Object));
    });

    // 4. Test Blindspots audit trigger
    const blindspotsTab = screen.getByRole("button", { name: /Blindspot Matrix/i });
    fireEvent.click(blindspotsTab);
    const auditBtn = screen.getByRole("button", { name: /Audit Document/i });
    fireEvent.click(auditBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/blindspots", expect.any(Object));
    });

    // 5. Test Policy Collider compare trigger
    const colliderTab = screen.getByRole("button", { name: /Policy Collider/i });
    fireEvent.click(colliderTab);
    const colliderInput = screen.getByPlaceholderText(/Paste proposed amended terms/i);
    fireEvent.change(colliderInput, { target: { value: "Section 4 amended to shift all indemnities." } });
    const compareBtn = screen.getByRole("button", { name: /Collide Versions/i });
    fireEvent.click(compareBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/diff", expect.any(Object));
    });

    // 6. Test Attorney Prep generation trigger
    const prepTab = screen.getByRole("button", { name: /Attorney Prep Sheet/i });
    fireEvent.click(prepTab);
    const generatePrepBtn = screen.getByRole("button", { name: /Generate Prep Sheet/i });
    fireEvent.click(generatePrepBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/copilot/attorney-prep", expect.any(Object));
    });

    // 7. Test Counter-Clause redline trigger
    const counterTab = screen.getByRole("button", { name: /Clause Rewriter/i });
    fireEvent.click(counterTab);
    const clauseTextarea = screen.getByPlaceholderText(/Paste one-sided clause to redline/i);
    fireEvent.change(clauseTextarea, { target: { value: "Customer indemnifies vendor without aggregate cap." } });
    const rewriteBtn = screen.getByRole("button", { name: /Draft Favorable Counter-Clause/i });
    fireEvent.click(rewriteBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/copilot/rewrite-clause", expect.any(Object));
    });
  }, 25000);

  it("handles offline fallback when prep sheet and rewrite endpoints reject", async () => {
    const mockRejectFetch = vi.fn().mockImplementation(() => Promise.reject(new Error("Offline network")));
    (globalThis as any).fetch = mockRejectFetch;

    render(<App />);

    // Test offline Attorney Prep fallback
    const prepTab = screen.getByRole("button", { name: /Attorney Prep Sheet/i });
    fireEvent.click(prepTab);
    const generatePrepBtn = screen.getByRole("button", { name: /Generate Prep Sheet/i });
    fireEvent.click(generatePrepBtn);

    await waitFor(() => {
      expect(screen.getByText(/Attorney Consultation Brief for Master_Services_Agreement_2026.pdf/i)).toBeInTheDocument();
    });

    // Test offline Clause Rewriter fallback
    const counterTab = screen.getByRole("button", { name: /Clause Rewriter/i });
    fireEvent.click(counterTab);
    const rewriteBtn = screen.getByRole("button", { name: /Draft Favorable Counter-Clause/i });
    fireEvent.click(rewriteBtn);

    await waitFor(() => {
      expect(screen.getByText(/Establishes a bilateral reciprocal cap/i)).toBeInTheDocument();
    });
  }, 25000);
});
