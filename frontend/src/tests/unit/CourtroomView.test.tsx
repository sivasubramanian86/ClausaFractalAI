import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CourtroomView } from "../../components/CourtroomView";

describe("CourtroomView Component Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders CourtroomView header, default bench verdict, and ratio decidendi", () => {
    render(<CourtroomView />);

    expect(
      screen.getByText("Judicial Chamber & Statutory Codex")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Honorable Bench/i, { selector: "span" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ratio Decidendi/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Statutory Proof Score/i)).toBeInTheDocument();
  });

  it("switches to Senior Advocate War Room tab and verifies strategy elements", () => {
    render(<CourtroomView />);

    const advocateTabButton = screen.getByRole("button", {
      name: /Senior Advocate War Room/i,
    });
    fireEvent.click(advocateTabButton);

    expect(
      screen.getByText(/Trial Probability Calculus/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Prosecution \/ Claimant Winning Arsenal/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Defense Counter-Shields & Mitigations/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cross-Examination Witness Traps/i)
    ).toBeInTheDocument();
  });

  it("switches to Case Dossier tab and allows modifying case facts", () => {
    render(<CourtroomView initialCaseText="State v. Alpha LLC breach inquiry" />);

    const dossierTabButton = screen.getByRole("button", {
      name: /Case Dossier & Evidence Ingestion/i,
    });
    fireEvent.click(dossierTabButton);

    expect(
      screen.getByText(/Multimodal Case Ingestion & Evidence Uploader/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Upload PDF Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Photo \/ Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Audio \/ Video/i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(
      /Enter or modify case facts/i
    );
    fireEvent.change(textarea, {
      target: { value: "Updated case allegations regarding forged wire transfers." },
    });
    expect(textarea).toHaveValue(
      "Updated case allegations regarding forged wire transfers."
    );
  });

  it("switches to Statutory Codex tab and interacts with search filter", async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          code_id: "IPC-420 / BNS-318(4)",
          title: "Cheating and Dishonestly Inducing Delivery of Property",
          jurisdiction: "India (IPC / BNS)",
          category: "Criminal / Fraud",
          elements: ["Deception of any person"],
          penalties: "Imprisonment up to 7 years",
          precedents: ["Hridaya Ranjan Prasad Verma v. State of Bihar"],
          statutory_test: "Fraudulent intention at inception",
        },
      ],
    });

    render(<CourtroomView />);

    const codexTabButton = screen.getByRole("button", {
      name: /Statutory Codex \(Law at Fingertips\)/i,
    });
    fireEvent.click(codexTabButton);

    expect(
      screen.getByText(/Global Statutory Codex & Penal Sections/i)
    ).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search by code/i);
    fireEvent.change(searchInput, { target: { value: "cheat" } });

    await waitFor(() => {
      expect(
        screen.getByText(/Cheating and Dishonestly Inducing Delivery of Property/i)
      ).toBeInTheDocument();
    });
  });

  it("handles Deliberate Case button click and updates analysis result", async () => {
    const mockResult = {
      dossier: {
        case_title: "In re: Live Deliberation Case",
        incident_type: "Cybercrime & Privacy",
        parties: {
          Prosecution_or_Plaintiff: "Cyber Defense Bureau",
          Defense_or_Respondent: "DarkWeb Operator",
        },
        facts_summary: "Facts regarding system penetration.",
        key_evidence: ["Exhibit A: Packet capture"],
        jurisdiction: "Federal",
      },
      verdict: {
        case_title: "In re: Live Deliberation Case",
        bench: "The Honorable Bench",
        ratio_decidendi: "Unauthorized access without authorization breaches CFAA.",
        obiter_dicta: "Observe network security guidelines.",
        element_proofs: [
          {
            element: "Intentionally accessing a protected computer",
            is_satisfied: true,
            evidentiary_basis: "Confirmed by IP logs.",
          },
        ],
        final_decree: "Guilty under CFAA",
        relief_or_sentence: "Maximum statutory fine",
        statutory_compliance_score: 9.8,
      },
      advocate_strategy: {
        counsel_role: "Lead Counsel",
        prosecution_strengths: ["Direct IP logs"],
        defense_shields: ["Chain of custody doubt"],
        cross_examination_traps: ["Confront on access timestamp"],
        evidentiary_vulnerabilities: ["Unsigned logs"],
        settlement_or_plea_calculus: "Plea bargain recommended",
        win_probability_prosecution: 0.9,
        win_probability_defense: 0.1,
      },
      matched_sections: [],
      disclaimer: "AI Jurisprudential Co-Counsel",
    };

    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    });

    render(<CourtroomView />);

    const deliberateBtn = screen.getByRole("button", { name: /Deliberate Case/i });
    fireEvent.click(deliberateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Guilty under CFAA/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/9.8 \/ 10.0/i)).toBeInTheDocument();
  });

  it("renders GCS Demo Data button and switches to dossier tab when clicked", () => {
    render(<CourtroomView />);

    const gcsDemoBtn = screen.getByRole("button", { name: /GCS Demo Data/i });
    expect(gcsDemoBtn).toBeInTheDocument();

    fireEvent.click(gcsDemoBtn);

    expect(
      screen.getByText(/Google Cloud Storage \(GCS\) Sample Media Catalog/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/gs:\/\/clausafractalai-demo-assets\//i)).toBeInTheDocument();
  });

  it("interacts with GCS Sample Media Catalog and switches between snapshot, audio, video, and pdf", async () => {
    render(<CourtroomView />);

    // Switch to dossier tab
    const dossierTabBtn = screen.getByRole("button", {
      name: /Case Dossier & Evidence Ingestion/i,
    });
    fireEvent.click(dossierTabBtn);

    // Click on CyberExtort sample case
    const cyberCaseBtn = screen.getByText(/In re: CyberExtort Cloud Data Penetration/i);
    fireEvent.click(cyberCaseBtn);

    // Verify textarea was populated with cyber case facts
    expect(
      screen.getByDisplayValue(/External threat actors intentionally breached healthcare cloud databases/i)
    ).toBeInTheDocument();

    // Verify media pills exist and switch between them
    const snapshotPill = screen.getByRole("button", { name: /Snapshot/i });
    const audioPill = screen.getByRole("button", { name: /Audio/i });
    const videoPill = screen.getByRole("button", { name: /Video/i });
    const pdfPill = screen.getByRole("button", { name: /PDF Brief/i });

    expect(snapshotPill).toBeInTheDocument();
    expect(audioPill).toBeInTheDocument();
    expect(videoPill).toBeInTheDocument();
    expect(pdfPill).toBeInTheDocument();

    // Switch to audio
    fireEvent.click(audioPill);
    expect(screen.getByText(/Recorded Deposition \/ Wiretap Audio/i)).toBeInTheDocument();

    // Switch to video
    fireEvent.click(videoPill);
    expect(screen.getByText(/Courtroom Hearing \/ Deposition Video Excerpt/i)).toBeInTheDocument();

    // Switch to pdf
    fireEvent.click(pdfPill);
    expect(screen.getByText(/Evidentiary Brief \/ Disputed Contract \(PDF\)/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open GCS Object/i })).toBeInTheDocument();

    // Switch back to snapshot
    fireEvent.click(snapshotPill);
    expect(screen.getByText(/Forensic Snapshot \/ Evidentiary Exhibit/i)).toBeInTheDocument();
  });
});

