import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("mock_user");
      const token = localStorage.getItem("token");
      
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend here
        } catch (e) {
          console.error("Auth init error", e);
          localStorage.removeItem("token");
          localStorage.removeItem("mock_user");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // REAL LOGIN
  const login = async (usernameOrEmail, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: usernameOrEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("mock_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      
      // Fallback for demo if backend is down or user not found
      if ((usernameOrEmail === "manager@example.com" || usernameOrEmail === "manager") && (password === "password123" || password === "pass1234")) {
        const fallbackUser = {
          id: "mock-mgr",
          username: "manager",
          email: "manager@example.com",
          role: "manager",
        };
        // Note: Without a real token, protected routes will still fail, 
        // but this allows getting into the dashboard.
        setUser(fallbackUser);
        localStorage.setItem("mock_user", JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      throw error;
    }
  };


  // MOCK REGISTER
  const register = async (username, email, password, department, role) => {
    const newUser = { username, email, password, department, role };
    const registeredUsers = JSON.parse(localStorage.getItem("mock_registered_users") || "[]");

    if (registeredUsers.some(u => u.username === username || u.email === email)) {
      throw new Error("User already exists");
    }

    registeredUsers.push(newUser);
    localStorage.setItem("mock_registered_users", JSON.stringify(registeredUsers));

    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem("mock_user", JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
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
