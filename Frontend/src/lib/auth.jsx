import React, { createContext, useContext, useEffect, useState } from "react";
import { queryClient } from "./queryClient";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const json = await res.json();
          if (res.ok && json.success) {
            setUser(json.data);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Auth fetch failed:", err);
        }
      }
      setIsLoading(false);
    };
    
    fetchUser();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password })
    });
    
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Invalid credentials");
    }

    localStorage.setItem("token", json.data.token);
    setUser(json.data.user);
  };

  const register = async (username, email, password, department, role) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, department, role })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Registration failed");
    }

    localStorage.setItem("token", json.data.token);
    setUser(json.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
