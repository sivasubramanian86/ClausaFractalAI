import React, { createContext, useContext, useState } from "react";

export type LegalRole = "counsel" | "arbitrator" | "auditor" | "founder";

export interface LegalUser {
  uid: string;
  email: string;
  displayName: string;
  role: LegalRole;
  organization: string;
}

interface AuthContextType {
  user: LegalUser;
  switchRole: (role: LegalRole) => void;
  token: string;
}

const ROLE_PROFILES: Record<LegalRole, LegalUser> = {
  counsel: {
    uid: "usr_counsel_77",
    email: "lead.counsel@enterprise.law",
    displayName: "Elena Vance, Esq.",
    role: "counsel",
    organization: "Global Legal Operations",
  },
  arbitrator: {
    uid: "usr_arbitrator_12",
    email: "arbitrator.tanaka@hkiac.org",
    displayName: "Hon. Kenji Tanaka",
    role: "arbitrator",
    organization: "International Arbitration Tribunal",
  },
  auditor: {
    uid: "usr_auditor_05",
    email: "risk.auditor@deloitte.com",
    displayName: "Marcus Thorne, CPA/CISA",
    role: "auditor",
    organization: "Enterprise Risk & Compliance",
  },
  founder: {
    uid: "usr_founder_01",
    email: "alex@fractalscale.io",
    displayName: "Alex Rivera (CEO)",
    role: "founder",
    organization: "FractalScale Technologies",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<LegalRole>("counsel");

  const switchRole = (newRole: LegalRole) => {
    setRole(newRole);
  };

  const user = ROLE_PROFILES[role];
  const token = `mock-${role}`;

  return (
    <AuthContext.Provider value={{ user, switchRole, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
