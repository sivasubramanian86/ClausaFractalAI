import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navigation } from "../../components/Navigation";
import { en } from "../../i18n/locales/en";

describe("Navigation Unit Test Suite", () => {
  it("renders all navigation items and responds to tab clicks", () => {
    const handleChange = vi.fn();
    render(<Navigation activeView="studio" onViewChange={handleChange} t={en} />);

    expect(screen.getByRole("button", { name: new RegExp(en.navStudio, "i") })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Judicial Chamber & Codex/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(en.navAnalytics, "i") })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(en.navFaq, "i") })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(en.navAbout, "i") })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(en.navGovernance, "i") })).toBeInTheDocument();

    // Click on Judicial tab
    fireEvent.click(screen.getByRole("button", { name: /Judicial Chamber & Codex/i }));
    expect(handleChange).toHaveBeenCalledWith("courtroom");

    // Click on FAQ tab
    fireEvent.click(screen.getByRole("button", { name: new RegExp(en.navFaq, "i") }));
    expect(handleChange).toHaveBeenCalledWith("faq");
  });
});
