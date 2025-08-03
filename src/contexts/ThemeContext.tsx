import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Theme {
  background: string;
  color: string;
  primary: string;
  secondary: string;
  border: string;
  inputBackground: string;
  inputColor: string;
}

const themes = {
  light: {
    background: '#f0f2f5',
    color: '#333333',
    primary: '#4CAF50',
    secondary: '#2196F3',
    border: '#cccccc',
    inputBackground: '#ffffff',
    inputColor: '#333333',
  },
  dark: {
    background: '#1a1a1a',
    color: '#e0e0e0',
    primary: '#4CAF50',
    secondary: '#2196F3',
    border: '#333333',
    inputBackground: '#2a2a2a',
    inputColor: '#e0e0e0',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setThemeName((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


