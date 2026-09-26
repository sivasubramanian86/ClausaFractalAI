import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HelpSection } from "../../components/HelpSection";
import { SettingsSection } from "../../components/SettingsSection";
import { ThemeProvider } from "../../context/ThemeContext";
import { AuthProvider } from "../../context/AuthContext";

describe("HelpSection Unit Tests", () => {
  it("renders help topics and navigates to correct views", () => {
    const handleNavigate = vi.fn();
    render(<HelpSection onNavigate={handleNavigate} />);

    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByText("Review a contract")).toBeInTheDocument();
    expect(screen.getByText("Explore a case")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Review a contract"));
    expect(handleNavigate).toHaveBeenCalledWith("studio");

    fireEvent.click(screen.getByText("Explore a case"));
    expect(handleNavigate).toHaveBeenCalledWith("courtroom");
  });
});

describe("SettingsSection Unit Tests", () => {
  it("renders preferences and allows changing theme and language", () => {
    const handleLanguageChange = vi.fn();
    render(
      <AuthProvider>
        <ThemeProvider>
          <SettingsSection language="en" onLanguageChange={handleLanguageChange} />
        </ThemeProvider>
      </AuthProvider>
    );

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();

    // Change appearance
    const appearanceSelect = screen.getByLabelText("Appearance");
    fireEvent.change(appearanceSelect, { target: { value: "light" } });

    // Change language
    const languageSelect = screen.getByLabelText("Language");
    fireEvent.change(languageSelect, { target: { value: "hi" } });
    expect(handleLanguageChange).toHaveBeenCalledWith("hi");

    // Shows demo account info
    expect(screen.getByText(/Demo session as Scott \(Demo\)/i)).toBeInTheDocument();
  });
});
