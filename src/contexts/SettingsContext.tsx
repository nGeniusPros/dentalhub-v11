import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our settings
interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  compactView: boolean;
}

// Define the context type
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: Settings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  fontSize: 'medium',
  compactView: false,
};

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Try to get settings from localStorage
    const savedSettings = localStorage.getItem('dental-hub-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    // Save to localStorage
    localStorage.setItem('dental-hub-settings', JSON.stringify(updatedSettings));
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('dental-hub-settings');
  };

  // Value to be provided to consumers
  const value = {
    settings,
    updateSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

// Custom hook for using the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
