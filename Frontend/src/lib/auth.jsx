import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // LOAD USER
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validate with backend
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const userData = data.data;
          setUser(userData);
          localStorage.setItem("mock_user", JSON.stringify(userData)); // keep mock in sync
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
    } else {
      // original fallback
      const savedUser = localStorage.getItem("mock_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }
  }, []);

  // REAL LOGIN
  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, usernameOrEmail: email })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || data.error || "Invalid credentials");
    
    const { token, user } = data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("mock_user", JSON.stringify(user));
    setUser(user);
  };

  // REAL REGISTER
  const register = async (username, email, password, department, role) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, department, role })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || data.error || "Registration failed");

    const { token, user } = data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("mock_user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("mock_user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
