import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../../components/Header";
import { ThemeProvider } from "../../context/ThemeContext";
import { AuthProvider } from "../../context/AuthContext";

describe("Header Unit Test Suite", () => {
  it("renders brand, switches languages, switches roles, and triggers theme switch", () => {
    const onLanguageChange = vi.fn();

    render(
      <ThemeProvider>
        <AuthProvider>
          <Header currentLanguage="en" onLanguageChange={onLanguageChange} />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByText("ClausaFractalAI")).toBeInTheDocument();

    // Language switcher
    const langSelect = screen.getByLabelText(/Select Interface Language/i);
    fireEvent.change(langSelect, { target: { value: "fr" } });
    expect(onLanguageChange).toHaveBeenCalledWith("fr");

    // Role switcher
    const roleSelect = screen.getByLabelText(/Active Legal Role/i);
    fireEvent.change(roleSelect, { target: { value: "arbitrator" } });
    expect((roleSelect as HTMLSelectElement).value).toBe("arbitrator");

    // Theme toggle button
    const themeBtn = screen.getByRole("button", { name: /Switch to Light Mode/i });
    fireEvent.click(themeBtn);
    expect(screen.getByRole("button", { name: /Switch to Dark Mode/i })).toBeInTheDocument();
  });
});
