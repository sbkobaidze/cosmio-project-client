import { api, isErrorResponse } from "@/lib/client";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { SessionState } from "types";

export function useSession() {
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
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);

      console.log(response);
      if (isErrorResponse(response)) {
        return {
          success: false,
          error: response.message || "Login failed",
        };
      }
      await fetchUser();
      navigate("/personal");
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: "Login failed",
      };
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error: string | null;
  }> => {
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
      const response = await api.logout();

      setSession({
        user: null,
        loading: false,
        error: null,
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

  return {
    user: session.user,
    loading: session.loading,
    error: session.error,
    login,
    logout,
    register,
    refresh: fetchUser,
  };
}
