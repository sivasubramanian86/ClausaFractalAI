import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Header } from "../components/Header";
import { DocumentViewer } from "../components/DocumentViewer";
import { ChatInterface } from "../components/ChatInterface";
import { BlindspotMatrix } from "../components/BlindspotMatrix";
import { PolicyCollider } from "../components/PolicyCollider";
import { AttorneyPrepView } from "../components/AttorneyPrepView";
import { CounterClauseView } from "../components/CounterClauseView";
import { App } from "../App";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";

describe("Frontend Components Test Suite", () => {
  it("renders Header with language selector and branding", () => {
    const handleLang = vi.fn();
    render(
      <ThemeProvider>
        <AuthProvider>
          <Header currentLanguage="en" onLanguageChange={handleLang} />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: /ClausaFractalAI/i })).toBeInTheDocument();

    const langSelect = screen.getByRole("combobox", { name: /Select Interface Language/i });
    expect(langSelect).toBeInTheDocument();

    fireEvent.change(langSelect, { target: { value: "es" } });
    expect(handleLang).toHaveBeenCalledWith("es");
  });

  it("renders DocumentViewer and handles page navigation and upload trigger", () => {
    const handleUpload = vi.fn().mockResolvedValue(undefined);
    const pages = [
      { pageNumber: 1, text: "Page 1 Content: Introduction and Term" },
      { pageNumber: 2, text: "Page 2 Content: Limitation of Liability" },
    ];

    render(
      <DocumentViewer
        documentId="doc_123"
        filename="contract.pdf"
        pages={pages}
        activeHighlight={{ page: 2, snippet: "Limitation of Liability" }}
        onFileUpload={handleUpload}
      />
    );

    expect(screen.getByText(/contract.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 2 Content/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: /Previous page/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Page 1 Content/i)).toBeInTheDocument();
  });

  it("renders ChatInterface, handles complexity switch, and triggers question send", async () => {
    const handleComplexity = vi.fn();
    const handleCitation = vi.fn();
    const handleSend = vi.fn().mockResolvedValue(undefined);

    const messages = [
      {
        id: "msg-1",
        sender: "agent" as const,
        text: "The liability is capped at $50,000.",
        citations: [{ clause: "Sec 4", page: 2, snippet: "capped at $50,000" }],
      },
    ];

    render(
      <ChatInterface
        documentId="doc_1"
        documentFilename="test.pdf"
        complexity="standard"
        onComplexityChange={handleComplexity}
        onCitationClick={handleCitation}
        messages={messages}
        onSendMessage={handleSend}
        isGenerating={false}
      />
    );

    expect(screen.getByText(/capped at \$50,000/i)).toBeInTheDocument();

    // Click citation chip
    const citBtn = screen.getByRole("button", { name: /Sec 4/i });
    fireEvent.click(citBtn);
    expect(handleCitation).toHaveBeenCalled();

    // Change complexity level to ELI5
    const eli5Btn = screen.getByRole("button", { name: "ELI5" });
    fireEvent.click(eli5Btn);
    expect(handleComplexity).toHaveBeenCalledWith("eli5");

    // Submit question
    const input = screen.getByPlaceholderText(/Ask about liability/i);
    fireEvent.change(input, { target: { value: "What is the penalty?" } });
    const askBtn = screen.getByRole("button", { name: /Send Question/i });
    fireEvent.click(askBtn);
    expect(handleSend).toHaveBeenCalledWith("What is the penalty?");
  });

  it("renders BlindspotMatrix with report and triggers audit", () => {
    const handleAudit = vi.fn().mockResolvedValue(undefined);
    const mockReport = {
      document_id: "doc_1",
      template_name: "mutual_nda",
      compliance_score: 75.0,
      critical_count: 1,
      omitted_findings: [
        {
          clause_key: "indemnity_cap",
          title: "Missing Indemnity Cap",
          severity: "CRITICAL" as const,
          risk_description: "Exposes company to unlimited indemnification.",
          suggested_clause: "Indemnity is strictly capped at $100,000.",
        },
      ],
    };

    render(
      <BlindspotMatrix
        documentId="doc_1"
        report={mockReport}
        isLoading={false}
        onAudit={handleAudit}
      />
    );

    expect(screen.getByText(/75.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Missing Indemnity Cap/i)).toBeInTheDocument();

    const auditBtn = screen.getByRole("button", { name: /Audit Document/i });
    fireEvent.click(auditBtn);
    expect(handleAudit).toHaveBeenCalledWith("mutual_nda");
  });

  it("renders PolicyCollider and handles collision submission", () => {
    const handleCompare = vi.fn().mockResolvedValue(undefined);
    const mockReport = {
      doc_a_id: "v1",
      doc_b_id: "v2",
      total_shifts_detected: 1,
      overall_verdict: "CAUTION: Detected surrendered rights.",
      impact_matrix: [
        {
          clause_topic: "Dispute Resolution",
          previous_term: "Court jurisdiction",
          new_term: "Mandatory binding arbitration",
          impact_type: "RIGHTS_SURRENDERED" as const,
          plain_english_takeaway: "Jury trial rights waived.",
          risk_level: "HIGH" as const,
        },
      ],
    };

    render(
      <PolicyCollider
        report={mockReport}
        onCompare={handleCompare}
        isLoading={false}
      />
    );

    expect(screen.getByText(/CAUTION/i)).toBeInTheDocument();
    expect(screen.getByText(/Dispute Resolution/i)).toBeInTheDocument();
    expect(screen.getByText(/RIGHTS SURRENDERED/i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Paste proposed amended terms/i);
    fireEvent.change(textarea, { target: { value: "New arbitration terms..." } });
    const collideBtn = screen.getByRole("button", { name: /Collide Versions/i });
    fireEvent.click(collideBtn);
    expect(handleCompare).toHaveBeenCalledWith("New arbitration terms...");
  });

  it("renders AttorneyPrepView and handles export and generation", () => {
    const handleGenerate = vi.fn().mockResolvedValue(undefined);
    const mockSheet = {
      document_id: "doc_sheet",
      executive_summary: "High priority risk areas identified in liability terms.",
      critical_red_flags: ["Unlimited consequential damages", "Unilateral venue"],
      attorney_questions: [
        {
          category: "Liability",
          question: "Can we carve out IP infringement?",
          context_rationale: "Reduces exposure to patent claims.",
        },
      ],
      negotiation_leverage_points: ["Counter with standard 12-month trailing fees cap."],
    };

    render(
      <AttorneyPrepView
        sheet={mockSheet}
        isLoading={false}
        onGenerate={handleGenerate}
      />
    );

    expect(screen.getByText(/High priority risk areas/i)).toBeInTheDocument();
    expect(screen.getByText(/Can we carve out IP infringement\?/i)).toBeInTheDocument();

    const genBtn = screen.getByRole("button", { name: /Generate Prep Sheet/i });
    fireEvent.click(genBtn);
    expect(handleGenerate).toHaveBeenCalled();
  });

  it("renders CounterClauseView and triggers redline generation", () => {
    const handleRewrite = vi.fn().mockResolvedValue(undefined);
    const mockProposal = {
      original_clause: "Customer agrees to unlimited liability.",
      counter_clause: "Each party liability is limited to fees paid.",
      strategic_rationale: "Establishes mutual commercial reciprocity.",
      negotiation_tip: "Cite standard enterprise procurement policies.",
    };

    render(
      <CounterClauseView
        proposal={mockProposal}
        isLoading={false}
        onRewrite={handleRewrite}
      />
    );

    expect(screen.getByText(/Establishes mutual commercial reciprocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Cite standard enterprise procurement policies/i)).toBeInTheDocument();

    const rewriteBtn = screen.getByRole("button", { name: /Draft Favorable Counter-Clause/i });
    fireEvent.click(rewriteBtn);
    expect(handleRewrite).toHaveBeenCalled();
  });

  it("renders full App studio and switches tabs smoothly", async () => {
    // Stub governance endpoints so GovernanceView useEffect fetch doesn't warn
    (globalThis as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/governance/audit-trail")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.includes("/api/governance/vpc-status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "ENFORCED",
              perimeter_name: "accessPolicies/p/servicePerimeters/clausa_perim",
              protected_services: ["aiplatform.googleapis.com"],
              ingress_policies_count: 1,
              egress_policies_count: 0,
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }) as any;

    render(<App />);

    expect(screen.getAllByText(/ClausaFractalAI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Verifiable Chat/i)).toBeInTheDocument();

    // Switch to Blindspots tab
    const blindspotsTab = screen.getByRole("button", { name: /Blindspot Matrix/i });
    fireEvent.click(blindspotsTab);
    expect(screen.getByText(/Blindspot Risk Matrix/i)).toBeInTheDocument();

    // Switch to Policy Collider tab
    const colliderTab = screen.getByRole("button", { name: /Policy Collider/i });
    fireEvent.click(colliderTab);
    expect(screen.getByText(/Policy Collider: Practical Impact Matrix/i)).toBeInTheDocument();

    // Switch to Attorney Prep tab
    const prepTab = screen.getByRole("button", { name: /Attorney Prep Sheet/i });
    fireEvent.click(prepTab);
    expect(screen.getByText(/Attorney Consultation Prep Sheet/i)).toBeInTheDocument();

    // Switch to Counter-Clauses tab
    const counterTab = screen.getByRole("button", { name: /Clause Rewriter/i });
    fireEvent.click(counterTab);
    expect(screen.getByText(/Counter-Clause Negotiation Rewriter/i)).toBeInTheDocument();

    // Test Navigation View switching: Analytics
    const analyticsNav = screen.getByRole("button", { name: /Analytics & Telemetry/i });
    fireEvent.click(analyticsNav);
    expect(screen.getByText(/BigQuery Enterprise Legal Telemetry/i)).toBeInTheDocument();

    // Test Navigation View switching: FAQ
    const faqNav = screen.getByRole("button", { name: /Legal AI FAQ/i });
    fireEvent.click(faqNav);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();

    // Test Navigation View switching: About
    const aboutNav = screen.getByRole("button", { name: /Agentic Architecture/i });
    fireEvent.click(aboutNav);
    expect(screen.getByText(/Agentic System Architecture/i)).toBeInTheDocument();

    // Test Navigation View switching: Governance — wrap in act() to flush useEffect fetch
    await act(async () => {
      const govNav = screen.getByRole("button", { name: /Governance & VPC-SC/i });
      fireEvent.click(govNav);
    });
    expect(screen.getByText(/Zero-Trust Security & Google Cloud Governance/i)).toBeInTheDocument();
  }, 20000);
});

