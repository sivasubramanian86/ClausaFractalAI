import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

const TestThemeConsumer = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme("light")}>SetLight</button>
      <button onClick={() => setTheme("dark")}>SetDark</button>
    </div>
  );
};

describe("ThemeContext Unit Test Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("defaults to dark theme and toggles between dark and light", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId("current-theme");
    expect(themeSpan.textContent).toBe("dark");

    const toggleBtn = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(toggleBtn);
    expect(themeSpan.textContent).toBe("light");
    expect(localStorage.getItem("clausa_theme")).toBe("light");

    fireEvent.click(toggleBtn);
    expect(themeSpan.textContent).toBe("dark");
    expect(localStorage.getItem("clausa_theme")).toBe("dark");
  });

  it("allows setting explicit theme and respects pre-saved localStorage", () => {
    localStorage.setItem("clausa_theme", "light");
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId("current-theme");
    expect(themeSpan.textContent).toBe("light");

    const setDarkBtn = screen.getByRole("button", { name: "SetDark" });
    fireEvent.click(setDarkBtn);
    expect(themeSpan.textContent).toBe("dark");
  });

  it("throws error when used outside provider", () => {
    // Suppress React error boundary log in test
    const consoleError = console.error;
    console.error = () => {};
    expect(() => render(<TestThemeConsumer />)).toThrow("useTheme must be used within a ThemeProvider");
    console.error = consoleError;
  });
});
