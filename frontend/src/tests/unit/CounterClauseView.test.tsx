import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CounterClauseView, CounterClauseData } from "../../components/CounterClauseView";

describe("CounterClauseView Unit Test Suite", () => {
  const sampleProposal: CounterClauseData = {
    original_clause: "Customer shall indemnify Vendor for all damages without limit.",
    counter_clause: "Each party shall mutually indemnify the other up to fees paid in the prior 12 months.",
    strategic_rationale: "Aligns with enterprise bilateral standard norms.",
    negotiation_tip: "Present as mandatory legal policy from corporate insurance counsel.",
  };

  it("renders empty state and submits counter-clause request", async () => {
    const onRewrite = vi.fn();
    render(<CounterClauseView onRewrite={onRewrite} proposal={null} isLoading={false} />);

    expect(screen.getByText(/No Counter-Clause Generated/i)).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/Paste one-sided clause to redline/i);
    fireEvent.change(textarea, { target: { value: "Customer agrees to unilateral uncapped indemnity." } });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "indemnity" } });

    const submitBtn = screen.getByRole("button", { name: /Draft Favorable Counter-Clause/i });
    fireEvent.click(submitBtn);

    expect(onRewrite).toHaveBeenCalledWith("Customer agrees to unilateral uncapped indemnity.", "indemnity");
  });

  it("renders proposal with redline comparison and strategic recommendations", () => {
    render(<CounterClauseView onRewrite={vi.fn()} proposal={sampleProposal} isLoading={false} />);

    expect(screen.getByText(/Customer shall indemnify Vendor for all damages without limit./i)).toBeInTheDocument();
    expect(screen.getByText(/Each party shall mutually indemnify the other up to fees paid in the prior 12 months./i)).toBeInTheDocument();
    expect(screen.getByText(/Aligns with enterprise bilateral standard norms./i)).toBeInTheDocument();
    expect(screen.getByText(/Present as mandatory legal policy from corporate insurance counsel./i)).toBeInTheDocument();
  });

  it("prevents submission when clause text is empty or component is loading", () => {
    const onRewrite = vi.fn();
    render(<CounterClauseView onRewrite={onRewrite} proposal={null} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/Paste one-sided clause to redline/i);
    fireEvent.change(textarea, { target: { value: "   " } });

    const form = textarea.closest("form")!;
    fireEvent.submit(form);

    expect(onRewrite).not.toHaveBeenCalled();
  });
});
