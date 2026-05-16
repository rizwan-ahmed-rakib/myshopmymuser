import React, { createContext, useState, useContext } from 'react';

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [navbarContent, setNavbarContent] = useState({
    title: 'Dashboard',
    subtitle: 'Welcome to your POS system',
    extraActions: null,
  });

  const updateNavbar = (content) => {
    setNavbarContent((prev) => ({
      ...prev,
      ...content,
    }));
  };

  const resetNavbar = () => {
    setNavbarContent({
      title: 'Dashboard',
      subtitle: 'Welcome to your POS system',
      extraActions: null,
    });
  };

  return (
    <NavbarContext.Provider value={{ navbarContent, updateNavbar, resetNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
