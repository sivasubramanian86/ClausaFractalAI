// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key-ci",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "clausafractalai.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "clausafractalai",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "clausafractalai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:mockappid",
};

// Avoid re-initialising on HMR
const app: FirebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export default app;
