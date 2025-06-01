import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, detectBrowserLanguage, getLanguagePreference, setLanguagePreference } from '@/lib/languages';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    // Try to get saved preference first, then fall back to browser detection
    return getLanguagePreference() || detectBrowserLanguage();
  });

  const setCurrentLanguage = (language: Language) => {
    setCurrentLanguageState(language);
    setLanguagePreference(language);
    // Update document direction based on language
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
  };

  // Initialize language settings on mount
  useEffect(() => {
    document.documentElement.dir = currentLanguage.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage.code;
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 