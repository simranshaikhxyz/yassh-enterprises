
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const user = localStorage.getItem("userInfo");
      return user ? JSON.parse(user) : null;
    } catch {
      localStorage.removeItem("userInfo");
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUserInfo(userData);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setUserInfo(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{ userInfo, login, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

