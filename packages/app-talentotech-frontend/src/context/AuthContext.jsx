import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AuthContext from "./AuthContextValue";
import {
  clearStoredIdToken,
  getCurrentSession,
  getStoredIdToken,
  register as registerWithApi,
  signIn as signInWithApi,
  storeIdToken,
} from "../services/AuthService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [storedIdToken] = useState(getStoredIdToken);
  const [loading, setLoading] = useState(Boolean(storedIdToken));
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!storedIdToken) {
      return;
    }

    let active = true;
    getCurrentSession(storedIdToken)
      .then(({ user: currentUser }) => {
        if (active) {
          setUser(currentUser);
        }
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        if (error.status === 401) {
          clearStoredIdToken();
        } else {
          console.error("Error recuperando la sesión:", error);
          setAuthError("No se pudo verificar la sesión. Intenta nuevamente.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [storedIdToken]);

  const signIn = useCallback(
    async (email, password) => {
      const session = await signInWithApi(email, password);
      storeIdToken(session.idToken);
      setUser(session.user);
      setAuthError("");
      return session;
    },
    [],
  );

  const register = useCallback(
    async (email, password) => {
      const session = await registerWithApi(email, password);
      storeIdToken(session.idToken);
      setUser(session.user);
      setAuthError("");
      return session;
    },
    [],
  );

  const signOut = useCallback(() => {
    clearStoredIdToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      signIn,
      register,
      signOut,
    }),
    [user, loading, authError, signIn, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
