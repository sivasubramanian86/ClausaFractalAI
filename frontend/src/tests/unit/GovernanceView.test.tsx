import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GovernanceView } from "../../components/GovernanceView";
import { AuthProvider } from "../../context/AuthContext";
import { en } from "../../i18n/locales/en";

describe("GovernanceView Unit Test Suite", () => {
  it("renders VPC-SC status, Firestore logs, simulates roles, and refreshes data", async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/governance/audit-trail")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                audit_id: "aud_test_9999",
                action: "LEGAL_QA_QUERY",
                timestamp: "2026-09-20T12:00:00Z",
                user: {
                  user_id: "usr_test",
                  email: "test.counsel@law.corp",
                  role: "counsel",
                  organization: "Test Legal",
                },
                details: { pii_scrubbed: true },
              },
            ]),
        });
      }
      if (url.includes("/api/governance/vpc-status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "ENFORCED",
              perimeter_name: "accessPolicies/p/servicePerimeters/clausa_perim",
              protected_services: ["aiplatform.googleapis.com", "bigquery.googleapis.com"],
              ingress_policies_count: 2,
              egress_policies_count: 0,
            }),
        });
      }
      return Promise.reject(new Error("Unknown route"));
    });

    (globalThis as any).fetch = mockFetch;

    render(
      <AuthProvider>
        <GovernanceView t={en} />
      </AuthProvider>
    );

    expect(screen.getByText(en.governanceTitle)).toBeInTheDocument();
    expect(screen.getByText(en.vpcStatus)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("ENFORCED")).toBeInTheDocument();
      expect(screen.getByText("aiplatform.googleapis.com")).toBeInTheDocument();
      expect(screen.getByText("aud_test_9999")).toBeInTheDocument();
    });

    // Test Role Switching in Simulator
    const arbitratorBtn = screen.getByRole("button", { name: new RegExp(en.roleArbitrator, "i") });
    fireEvent.click(arbitratorBtn);

    expect(screen.getByText(/Hon. Kenji Tanaka/i)).toBeInTheDocument();

    // Test Refresh Button — wrap in act because click triggers async fetch → setState
    await act(async () => {
      const refreshBtn = screen.getByRole("button", { name: /Refresh Governance State/i });
      fireEvent.click(refreshBtn);
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  it("renders default fallback protected services and perimeter when omitted in vpcStatus", async () => {
    (globalThis as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/governance/vpc-status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "ENFORCED_FALLBACK",
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    render(
      <AuthProvider>
        <GovernanceView t={en} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("ENFORCED_FALLBACK")).toBeInTheDocument();
      expect(screen.getByText("firestore.googleapis.com")).toBeInTheDocument();
      expect(screen.getByText(/Perimeter: clausa_perimeter/i)).toBeInTheDocument();
    });
  });

  it("gracefully catches network failure in fetchGovernanceData", async () => {
    (globalThis as any).fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    render(
      <AuthProvider>
        <GovernanceView t={en} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(en.governanceTitle)).toBeInTheDocument();
      expect(screen.getByText("aud_01_sample")).toBeInTheDocument();
    });
  });
});
