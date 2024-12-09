import { api, isErrorResponse } from "@/lib/client";
import { useLoginsStore, useNotifications } from "@/lib/state";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";
import type { SessionState } from "types";

const socket = io("http://localhost:3434", {
  withCredentials: true,
  autoConnect: false,
});

interface AuthContextType {
  user: SessionState["user"];
  loading: boolean;
  error: string | null;
  socket: Socket;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  logout: () => Promise<{
    success: boolean;
    error: string | null;
  }>;
  register: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    user: null,
    loading: true,
    error: null,
  });
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.getProtected();

      if (isErrorResponse(response)) {
        setSession({
          user: null,
          loading: false,
          error: response.message || "Failed to fetch user session",
        });
        return;
      }

      setSession({
        user: { email: response.data.email },
        loading: false,
        error: null,
      });
    } catch {
      setSession({
        user: null,
        loading: false,
        error: "Failed to fetch user session",
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);

      if (isErrorResponse(response)) {
        return {
          success: false,
          error: response.message || "Login failed",
        };
      }
      navigate("/personal");
      await fetchUser();

      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: "Login failed",
      };
    }
  };

  const register = async (email: string, password: string) => {
    const res = await api.register(email, password);

    if (isErrorResponse(res)) {
      return {
        success: false,
        error: res.message || "Register failed",
      };
    }
    await fetchUser();

    return { success: true, error: null };
  };

  const logout = async () => {
    try {
      await api.logout();

      setSession({
        user: null,
        loading: false,
        error: null,
      });

      socket.disconnect();

      useNotifications.setState({ notifications: [] });
      useLoginsStore.setState({
        globalLogins: null,
        personalLogins: null,
      });

      navigate("/");
      return { success: true, error: null };
    } catch {
      return {
        success: false,
        error: "Logout failed",
      };
    }
  };

  const value = {
    user: session.user,
    loading: session.loading,
    error: session.error,
    login,
    logout,
    register,
    refresh: fetchUser,
    socket: socket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
}
