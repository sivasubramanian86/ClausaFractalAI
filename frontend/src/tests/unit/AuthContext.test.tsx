import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "../../context/AuthContext";

const TestConsumer: React.FC = () => {
  const { user, switchRole, token } = useAuth();
  return (
    <div>
      <span data-testid="role">{user.role}</span>
      <span data-testid="token">{token}</span>
      <button onClick={() => switchRole("auditor")}>Switch to Auditor</button>
    </div>
  );
};

describe("AuthContext Unit Tests", () => {
  it("provides default counsel user and allows switching role", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("role").textContent).toBe("counsel");
    expect(screen.getByTestId("token").textContent).toBe("mock-counsel");

    fireEvent.click(screen.getByText("Switch to Auditor"));

    expect(screen.getByTestId("role").textContent).toBe("auditor");
    expect(screen.getByTestId("token").textContent).toBe("mock-auditor");
  });

  it("throws error when useAuth is called outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
  });
});
