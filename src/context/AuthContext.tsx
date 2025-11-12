import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  avatar?: string | null | File;
  firstName?: string;  
  lastName?: string;   
  email: string;
  role: "admin" | "sub_admin" | "delivery_agent" | "customer" | string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  saveAuthData: (userData: User, token: string) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // 🏷️ Save user + token based on role
  const saveAuthData = (userData: User, token: string) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    sessionStorage.setItem("userRole", userData.role);

    switch (userData.role) {
      case "admin":
      case "sub_admin": // Sub-admin uses same token storage as admin
        sessionStorage.setItem("adminToken", token);
        break;
      case "delivery_agent":
        sessionStorage.setItem("agentToken", token);
        break;
      case "customer":
        sessionStorage.setItem("customerToken", token);
        break;
      default:
        sessionStorage.setItem("authToken", token);
        break;
    }

    setUser(userData);
  };

  // 🔑 Retrieve correct token based on current role
  const getToken = (): string | null => {
    const role = sessionStorage.getItem("userRole");

    switch (role) {
      case "admin":
      case "sub_admin": // Sub-admin uses same token as admin
        return sessionStorage.getItem("adminToken");
      case "delivery_agent":
        return sessionStorage.getItem("agentToken");
      case "customer":
        return sessionStorage.getItem("customerToken");
      default:
        return sessionStorage.getItem("authToken");
    }
  };

  // Logout cleanup
 const logout = () => {
  const role = sessionStorage.getItem("userRole");
  
    // Remove tokens based on role
  if (role === "admin" || role === "sub_admin") {
    sessionStorage.removeItem("adminToken");
  } else if (role === "delivery_agent") {
    sessionStorage.removeItem("agentToken");
  } else if (role === "customer") {
    sessionStorage.removeItem("customerToken");
    } else {
      sessionStorage.removeItem("authToken");
  }
  
    // Clear user data
  localStorage.removeItem("userData");
  sessionStorage.removeItem("userRole");
  
  setUser(null);
  
    // Redirect based on role
  setTimeout(()=>{
  if (role === "customer") {
      navigate("/"); // home page
  } else if (role === "admin" || role === "sub_admin") {
      navigate("/admin"); // admin panel
    }
    else{
       navigate("/login"); //agent login page
  }
  },(100))
};


  return (
    <AuthContext.Provider value={{ user, setUser, logout, saveAuthData, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
