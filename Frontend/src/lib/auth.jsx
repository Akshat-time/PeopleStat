import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    console.log("Auth useEffect running");
    const savedUser = localStorage.getItem("mock_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      console.log("Loaded user from localStorage", JSON.parse(savedUser));
    } else {
      // Default to manager for testing
      const defaultUser = {
        username: "manager",
        role: "manager",
      };
      localStorage.setItem("mock_user", JSON.stringify(defaultUser));
      setUser(defaultUser);
      console.log("Set default user", defaultUser);
    }
    setIsLoading(false);
    console.log("Set isLoading to false");
  }, []);

  // MOCK LOGIN
  const login = async (usernameOrEmail, password) => {
    // Check localStorage for registered users first
    const registeredUsers = JSON.parse(localStorage.getItem("mock_registered_users") || "[]");
    const foundUser = registeredUsers.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      localStorage.setItem("mock_user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return;
    }

    // fallback to default mock logins
    if (usernameOrEmail === "employee" && password === "1234") {
      const employeeUser = {
        username: "employee",
        role: "employee",
        employeeId: "EMP001",
      };
      localStorage.setItem("mock_user", JSON.stringify(employeeUser));
      setUser(employeeUser);
      return;
    }

    if (usernameOrEmail === "manager" && password === "1234") {
      const managerUser = {
        username: "manager",
        role: "manager",
      };
      localStorage.setItem("mock_user", JSON.stringify(managerUser));
      setUser(managerUser);
      return;
    }

    throw new Error("Invalid credentials");
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
