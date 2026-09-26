import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PolicyCollider, PolicyCollisionReportData } from "../../components/PolicyCollider";

describe("PolicyCollider Unit Test Suite", () => {
  const sampleCautionReport: PolicyCollisionReportData = {
    doc_a_id: "doc_v1",
    doc_b_id: "doc_v2",
    total_shifts_detected: 4,
    overall_verdict: "CAUTION: Heavy erosion of customer protections",
    impact_matrix: [
      {
        clause_topic: "Indemnification",
        previous_term: "Mutual indemnity",
        new_term: "Customer unilateral indemnity",
        impact_type: "RIGHTS_SURRENDERED",
        plain_english_takeaway: "Customer surrenders bilateral protection.",
        risk_level: "HIGH",
      },
      {
        clause_topic: "Liability Limits",
        previous_term: "$100,000 Cap",
        new_term: "Uncapped liability for vendor claims",
        impact_type: "LIABILITY_INCREASE",
        plain_english_takeaway: "Escalates exposure to company balance sheet.",
        risk_level: "HIGH",
      },
      {
        clause_topic: "Data Privacy",
        previous_term: "Standard SLA",
        new_term: "SOC2 Type II and HIPAA compliance guarantees",
        impact_type: "BENEFIT_GAINED",
        plain_english_takeaway: "Gains audit and compliance coverage.",
        risk_level: "LOW",
      },
      {
        clause_topic: "Notices",
        previous_term: "Certified mail",
        new_term: "Email notification acceptable",
        impact_type: "NEUTRAL",
        plain_english_takeaway: "Procedural modernization.",
        risk_level: "LOW",
      },
    ],
  };

  const sampleFavorableReport: PolicyCollisionReportData = {
    doc_a_id: "doc_v1",
    doc_b_id: "doc_v2",
    total_shifts_detected: 0,
    overall_verdict: "FAVORABLE: Well-balanced bilateral terms",
    impact_matrix: [],
  };

  it("renders empty state, accepts input, and submits comparison", async () => {
    const onCompare = vi.fn();
    render(<PolicyCollider onCompare={onCompare} report={null} isLoading={false} />);

    expect(screen.getByText(/No Policy Collisions/i)).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/Paste proposed amended terms/i);
    fireEvent.change(textarea, { target: { value: "Amended Section 4 text" } });

    const submitBtn = screen.getByRole("button", { name: /Collide Versions/i });
    fireEvent.click(submitBtn);

    expect(onCompare).toHaveBeenCalledWith("Amended Section 4 text");
  });

  it("renders all impact types with caution verdict banner", () => {
    render(<PolicyCollider onCompare={vi.fn()} report={sampleCautionReport} isLoading={false} />);

    expect(screen.getByText(/CAUTION: Heavy erosion of customer protections/i)).toBeInTheDocument();
    expect(screen.getByText("RIGHTS SURRENDERED")).toBeInTheDocument();
    expect(screen.getByText("LIABILITY ESCALATED")).toBeInTheDocument();
    expect(screen.getByText("BENEFIT GAINED")).toBeInTheDocument();
    expect(screen.getByText("NEUTRAL SHIFT")).toBeInTheDocument();
  });

  it("renders favorable verdict banner and empty shifts fallback", () => {
    render(<PolicyCollider onCompare={vi.fn()} report={sampleFavorableReport} isLoading={false} />);

    expect(screen.getByText(/FAVORABLE: Well-balanced bilateral terms/i)).toBeInTheDocument();
    expect(screen.getByText(/No Policy Collisions/i)).toBeInTheDocument();
  });

  it("prevents comparison submit when input text is empty", () => {
    const onCompare = vi.fn();
    render(<PolicyCollider onCompare={onCompare} report={null} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/Paste proposed amended terms/i);
    fireEvent.change(textarea, { target: { value: "   " } });

    const form = textarea.closest("form")!;
    fireEvent.submit(form);

    expect(onCompare).not.toHaveBeenCalled();
  });
});
