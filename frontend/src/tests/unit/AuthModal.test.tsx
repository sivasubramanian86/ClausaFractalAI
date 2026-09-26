import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthModal } from "../../components/AuthModal";
import { AuthProvider } from "../../context/AuthContext";

describe("AuthModal Unit Tests", () => {
  it("renders sign-in modal, allows switching to sign-up, input entry, and closing", async () => {
    const handleClose = vi.fn();
    render(
      <AuthProvider>
        <AuthModal onClose={handleClose} />
      </AuthProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();

    // Toggle password visibility
    const passwordInput = screen.getByPlaceholderText(/Password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "SuperSecret123" } });
    expect(passwordInput.value).toBe("SuperSecret123");

    // Toggle visibility button
    const eyeBtn = screen.getByLabelText(/password/i);
    fireEvent.click(eyeBtn);

    // Switch to Sign Up tab
    const signUpBtn = screen.getByRole("button", { name: "Sign up" });
    fireEvent.click(signUpBtn);
    expect(screen.getByText(/Create account/i)).toBeInTheDocument();

    // Enter name on sign up
    const nameInput = screen.getByPlaceholderText("Full name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Test Lawyer" } });
    expect(nameInput.value).toBe("Test Lawyer");

    // Close button
    const closeBtn = screen.getByLabelText("Close");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
