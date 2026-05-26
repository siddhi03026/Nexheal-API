import { useState, useEffect } from "react";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (newUser: User, newToken: string, newRefreshToken: string) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  const isAuthenticated = !!token;

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };
}
