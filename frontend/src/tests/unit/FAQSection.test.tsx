import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FAQSection } from "../../components/FAQSection";
import { en } from "../../i18n/locales/en";

describe("FAQSection Unit Test Suite", () => {
  it("renders FAQs, filters by category, searches questions, and expands items", () => {
    render(<FAQSection t={en} />);

    expect(screen.getByText(en.faqTitle)).toBeInTheDocument();

    // Category filter: Click on 0% Hallucination
    const groundingCat = screen.getByRole("button", { name: /^0% Hallucination$/i });
    fireEvent.click(groundingCat);

    expect(screen.getByText(/0.00% Hallucination Rate/i)).toBeInTheDocument();

    // Search for VPC-SC
    const searchInput = screen.getByPlaceholderText(/Search FAQs on ReAct loops/i);
    fireEvent.change(searchInput, { target: { value: "VPC" } });

    // Switch to security category
    const secCat = screen.getByRole("button", { name: /GCP Security & VPC-SC/i });
    fireEvent.click(secCat);
    expect(screen.getByText(/How are enterprise contracts protected under Google Cloud Security standards/i)).toBeInTheDocument();

    // Expand accordion item
    const questionBtn = screen.getByText(/How are enterprise contracts protected under Google Cloud Security standards/i);
    fireEvent.click(questionBtn);
    expect(screen.getByText(/VPC Service Controls \(VPC-SC\) perimeters/i)).toBeInTheDocument();
  });
});
