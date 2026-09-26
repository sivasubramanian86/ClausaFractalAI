import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export type LegalRole = "counsel" | "arbitrator" | "auditor" | "founder";

export interface LegalUser {
  uid: string;
  email: string;
  displayName: string;
  role: LegalRole;
  organization: string;
  photoURL?: string;
  firebaseUser?: User | null;
}

interface AuthContextType {
  user: LegalUser;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  switchRole: (role: LegalRole) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  token: string;
  authError: string | null;
}

const ROLE_PROFILES: Record<LegalRole, Omit<LegalUser, "photoURL" | "firebaseUser">> = {
  counsel: {
    uid: "usr_tenant_77",
    email: "priya.sharma@accesslegal.org",
    displayName: "Priya Sharma (Tenant)",
    role: "counsel",
    organization: "Residential Tenancy & Lease Review",
  },
  arbitrator: {
    uid: "usr_employee_12",
    email: "david.chen@workplaceaccess.org",
    displayName: "David Chen (Employee)",
    role: "arbitrator",
    organization: "Employment Agreements & Fair Labor",
  },
  auditor: {
    uid: "usr_freelancer_05",
    email: "alex.morgan@freelanceguild.org",
    displayName: "Alex Morgan (Freelancer)",
    role: "auditor",
    organization: "Independent Contractor & Creator Rights",
  },
  founder: {
    uid: "usr_smb_01",
    email: "elena@mainstreetbakery.com",
    displayName: "Elena Rostova (Small Business)",
    role: "founder",
    organization: "Small Business Commerce & Vendor Terms",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [role, setRole] = useState<LegalRole>("counsel");
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    void getRedirectResult(auth).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setAuthError(msg.replace("Firebase: ", ""));
    });
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const buildUser = (fbUser: User | null): LegalUser => {
    const base = ROLE_PROFILES[role];
    if (!fbUser) return base;
    return {
      ...base,
      uid: fbUser.uid,
      email: fbUser.email ?? base.email,
      displayName: fbUser.displayName ?? fbUser.email?.split("@")[0] ?? base.displayName,
      photoURL: fbUser.photoURL ?? undefined,
      firebaseUser: fbUser,
    };
  };

  const switchRole = (newRole: LegalRole) => setRole(newRole);

  const clearError = () => setAuthError(null);

  const signInWithGoogle = async () => {
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      if (window.matchMedia("(max-width: 767px)").matches) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setAuthError(msg.replace("Firebase: ", ""));
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setAuthError(msg.replace("Firebase: ", "").replace(/\(auth\/.*?\)\.?/, "").trim());
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    clearError();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-up failed";
      setAuthError(msg.replace("Firebase: ", "").replace(/\(auth\/.*?\)\.?/, "").trim());
    }
  };

  const signOut = async () => {
    clearError();
    await firebaseSignOut(auth);
    setRole("counsel");
  };

  const user = buildUser(firebaseUser);
  const token = firebaseUser ? `firebase-${firebaseUser.uid}` : `mock-${role}`;

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        isLoading,
        switchRole,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        token,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
