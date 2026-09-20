import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AttorneyPrepView, AttorneyPrepSheetData } from "../../components/AttorneyPrepView";

describe("AttorneyPrepView Unit Test Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const sampleSheet: AttorneyPrepSheetData = {
    document_id: "doc_test_101",
    executive_summary: "Comprehensive SaaS Agreement with significant liability skew.",
    critical_red_flags: [
      "Uncapped customer indemnification obligations",
      "One-way IP assignment without carve-outs",
    ],
    attorney_questions: [
      {
        category: "Liability",
        question: "Can we cap indemnification to 12 months trailing fees?",
        context_rationale: "Aligns exposure to standard commercial risk.",
      },
      {
        category: "Dispute",
        question: "Should we insert mutual arbitration clause?",
        context_rationale: "Prevents protracted court litigation in foreign jurisdiction.",
      },
    ],
    negotiation_leverage_points: [
      "Vendor needs Q3 close for public earnings targets",
      "Customer holds dual-source RFP alternative",
    ],
  };

  it("renders empty state when no sheet is provided", () => {
    const onGenerate = vi.fn();
    render(<AttorneyPrepView onGenerate={onGenerate} sheet={null} isLoading={false} />);

    expect(screen.getByText(/No Prep Sheet Generated/i)).toBeInTheDocument();
    const generateBtn = screen.getByRole("button", { name: /Generate Prep Sheet/i });
    fireEvent.click(generateBtn);
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });

  it("renders loading state button", () => {
    render(<AttorneyPrepView onGenerate={vi.fn()} sheet={null} isLoading={true} />);
    expect(screen.getByRole("button", { name: /Generating.../i })).toBeDisabled();
  });

  it("renders full sheet and handles export click", () => {
    const createObjectURLMock = vi.fn(() => "blob:http://localhost/test-blob");
    const revokeObjectURLMock = vi.fn();
    global.URL.createObjectURL = createObjectURLMock as any;
    global.URL.revokeObjectURL = revokeObjectURLMock as any;

    const anchorClickMock = vi.fn();
    window.HTMLAnchorElement.prototype.click = anchorClickMock;

    render(<AttorneyPrepView onGenerate={vi.fn()} sheet={sampleSheet} isLoading={false} />);

    expect(screen.getByText(/Comprehensive SaaS Agreement with significant liability skew./i)).toBeInTheDocument();
    expect(screen.getByText(/Uncapped customer indemnification obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Can we cap indemnification to 12 months trailing fees\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Vendor needs Q3 close for public earnings targets/i)).toBeInTheDocument();

    const exportBtn = screen.getByRole("button", { name: /Export Prep Sheet/i });
    fireEvent.click(exportBtn);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(anchorClickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});
