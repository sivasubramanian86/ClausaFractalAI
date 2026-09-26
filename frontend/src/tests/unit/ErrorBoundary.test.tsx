import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "../../components/ErrorBoundary";

const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Simulated Test Crash");
  }
  return <div>Component Functioning Normally</div>;
};

describe("ErrorBoundary Unit Test Suite", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary fallbackTitle="Custom Fallback">
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Component Functioning Normally")).toBeInTheDocument();
  });

  it("catches runtime errors and renders fallback UI with recovery button", () => {
    const handleReset = vi.fn();

    // Prevent React test error log pollution
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackTitle="Custom View Interrupted" onReset={handleReset}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom View Interrupted")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Recover & Reload View/i })).toBeInTheDocument();

    // Toggle diagnostic details
    const diagBtn = screen.getByRole("button", { name: /View Diagnostic/i });
    fireEvent.click(diagBtn);
    expect(screen.getByText(/Simulated Test Crash/i)).toBeInTheDocument();

    // Test reset handler
    const resetBtn = screen.getByRole("button", { name: /Recover & Reload View/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("renders default fallbackTitle when none is provided", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Component Render Disruption Caught")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
