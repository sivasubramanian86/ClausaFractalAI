import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AboutSection } from "../../components/AboutSection";
import { en } from "../../i18n/locales/en";

describe("AboutSection Unit Test Suite", () => {
  it("renders 5 foundational papers and switches sub-tabs", () => {
    render(<AboutSection t={en} />);

    expect(screen.getByText(en.aboutTitle)).toBeInTheDocument();
    expect(screen.getByText(/ReAct: Reasoning \+ Acting in Language Models/i)).toBeInTheDocument();
    expect(screen.getByText(/Toolformer: Models Can Teach Themselves to Use Tools/i)).toBeInTheDocument();

    // Switch to 40M-Doc Knowledge Graph
    const graphTab = screen.getByRole("button", { name: /40M-Doc Knowledge Graph/i });
    fireEvent.click(graphTab);
    expect(screen.getByText(/Fareed Khan's 40M-Doc Architecture Adaptation/i)).toBeInTheDocument();
    expect(screen.getByText(/Deterministic Refusal Ladder/i)).toBeInTheDocument();

    // Switch to Agentic AI for Leaders
    const leadersTab = screen.getByRole("button", { name: /Agentic AI for Leaders/i });
    fireEvent.click(leadersTab);
    expect(screen.getByText(/Concentric Agentic AI Hierarchy/i)).toBeInTheDocument();
    expect(screen.getByText(/LEVEL 4 \(CLAUSA\)/i)).toBeInTheDocument();

    // Switch back to papers
    const papersTab = screen.getByRole("button", { name: /5 Research Papers/i });
    fireEvent.click(papersTab);
    expect(screen.getByText(/ReAct: Reasoning \+ Acting in Language Models/i)).toBeInTheDocument();
  });
});
