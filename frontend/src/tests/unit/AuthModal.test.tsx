import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { AuthModal } from "../../components/AuthModal";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import * as firebaseAuth from "firebase/auth";

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>();
  return {
    ...actual,
    signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: "test-user-google" } }),
    signInWithRedirect: vi.fn().mockResolvedValue(undefined),
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "test-user-email" } }),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "test-user-new" } }),
    signOut: vi.fn().mockResolvedValue(undefined),
    updateProfile: vi.fn().mockResolvedValue(undefined),
    getRedirectResult: vi.fn().mockResolvedValue(null),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(null);
      return vi.fn();
    }),
  };
});

describe("AuthModal and AuthContext Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

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
    expect(screen.getByRole("heading", { name: /Create account/i })).toBeInTheDocument();

    // Enter name on sign up
    const nameInput = screen.getByPlaceholderText("Full name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Test Lawyer" } });
    expect(nameInput.value).toBe("Test Lawyer");

    // Close button
    const closeBtn = screen.getByLabelText("Close");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("submits email sign in and sign up forms in AuthModal", async () => {
    const handleClose = vi.fn();
    render(
      <AuthProvider>
        <AuthModal onClose={handleClose} />
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(emailInput, { target: { value: "attorney@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Secret123!" } });

    const submitBtn = screen.getByRole("button", { name: /Sign in/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();

    // Google Sign-in button
    const googleBtn = screen.getByRole("button", { name: /Continue with Google/i });
    await act(async () => {
      fireEvent.click(googleBtn);
    });
    expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();

    // Switch to Sign Up and submit
    const signUpTab = screen.getByRole("button", { name: "Sign up" });
    fireEvent.click(signUpTab);

    const nameInput = screen.getByPlaceholderText("Full name");
    fireEvent.change(nameInput, { target: { value: "Juris Doctor" } });

    const createBtn = screen.getByRole("button", { name: /Create account/i });
    await act(async () => {
      fireEvent.click(createBtn);
    });
    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
  });

  it("exercises AuthContext methods: switchRole, signOut, and mobile google redirect", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user.role).toBe("counsel");

    act(() => {
      result.current.switchRole("arbitrator");
    });
    expect(result.current.user.role).toBe("arbitrator");

    await act(async () => {
      await result.current.signOut();
    });
    expect(firebaseAuth.signOut).toHaveBeenCalled();
    expect(result.current.user.role).toBe("counsel");

    // Mock mobile viewport for google redirect
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width: 767px"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(firebaseAuth.signInWithRedirect).toHaveBeenCalled();
  });

  it("handles auth errors gracefully in AuthContext", async () => {
    vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockRejectedValueOnce(
      new Error("Firebase: (auth/wrong-password).")
    );
    vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockRejectedValueOnce(
      new Error("Firebase: (auth/email-already-in-use).")
    );
    vi.mocked(firebaseAuth.signInWithPopup).mockRejectedValueOnce(
      new Error("Popup blocked by browser")
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithEmail("bad@example.com", "wrong");
    });
    expect(result.current.authError).toBeDefined();

    await act(async () => {
      await result.current.signUpWithEmail("existing@example.com", "pass", "Name");
    });
    expect(result.current.authError).toBeDefined();

    // Reset window.matchMedia for desktop
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(result.current.authError).toContain("Popup blocked");
  });
});

