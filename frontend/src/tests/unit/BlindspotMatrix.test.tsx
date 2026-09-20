import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BlindspotMatrix, BlindspotReportData } from "../../components/BlindspotMatrix";

describe("BlindspotMatrix Unit Test Suite", () => {
  const sampleReportHigh: BlindspotReportData = {
    document_id: "doc_test_101",
    template_name: "mutual_nda",
    compliance_score: 90,
    critical_count: 0,
    omitted_findings: [
      {
        clause_key: "reciprocal_term",
        title: "Reciprocal Confidentiality Scope",
        severity: "RECOMMENDED" as const,
        risk_description: "Non-critical suggestion to explicitly include affiliate disclosures.",
        suggested_clause: "Disclosures to affiliates are covered under standard terms.",
      },
    ],
  };

  const sampleReportLow: BlindspotReportData = {
    document_id: "doc_test_102",
    template_name: "saas_sla",
    compliance_score: 45,
    critical_count: 2,
    omitted_findings: [
      {
        clause_key: "gross_negligence",
        title: "Gross Negligence Carve-out Omitted",
        severity: "CRITICAL",
        risk_description: "Caps all liability including gross negligence.",
        suggested_clause: "Liability limits shall not apply to gross negligence.",
      },
      {
        clause_key: "audit_rights",
        title: "Customer SOC2 Audit Rights Missing",
        severity: "WARNING",
        risk_description: "Customer cannot inspect vendor compliance.",
        suggested_clause: "Customer may request annual SOC2 Type II reports.",
      },
      {
        clause_key: "optional_notice",
        title: "Optional Courtesy Notice",
        severity: "RECOMMENDED" as const,
        risk_description: "Minor courtesy clause.",
        suggested_clause: "Parties may send courtesy email.",
      },
    ],
  };

  const sampleReportMed: BlindspotReportData = {
    document_id: "doc_test_103",
    template_name: "employment_agreement",
    compliance_score: 65,
    critical_count: 1,
    omitted_findings: [],
  };

  it("renders empty state and allows changing baseline template", async () => {
    const onAudit = vi.fn();
    render(<BlindspotMatrix documentId="doc_1" report={null} isLoading={false} onAudit={onAudit} />);

    expect(screen.getByText(/Full Baseline Compliance/i)).toBeInTheDocument();
    const select = screen.getByLabelText(/Select Baseline Standard Template/i);
    fireEvent.change(select, { target: { value: "saas_sla" } });

    const auditBtn = screen.getByRole("button", { name: /Audit Document/i });
    fireEvent.click(auditBtn);
    expect(onAudit).toHaveBeenCalledWith("saas_sla");
  });

  it("renders high compliance report with score badge and info finding", () => {
    render(<BlindspotMatrix documentId="doc_1" report={sampleReportHigh} isLoading={false} onAudit={vi.fn()} />);

    expect(screen.getByText("90.0%")).toBeInTheDocument();
    expect(screen.getByText(/Reciprocal Confidentiality Scope/i)).toBeInTheDocument();
    expect(screen.getByText("RECOMMENDED")).toBeInTheDocument();
  });

  it("renders low compliance report with critical and warning badges", () => {
    render(<BlindspotMatrix documentId="doc_2" report={sampleReportLow} isLoading={false} onAudit={vi.fn()} />);

    expect(screen.getByText("45.0%")).toBeInTheDocument();
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
    expect(screen.getByText("WARNING")).toBeInTheDocument();
  });

  it("renders medium compliance report with 0 omissions empty list", () => {
    render(<BlindspotMatrix documentId="doc_3" report={sampleReportMed} isLoading={false} onAudit={vi.fn()} />);

    expect(screen.getByText("65.0%")).toBeInTheDocument();
    expect(screen.getByText(/Full Baseline Compliance/i)).toBeInTheDocument();
  });
});
