import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Define the context type
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  useSystemLanguage: boolean;
  setUseSystemLanguage: (use: boolean) => void;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: () => {},
  useSystemLanguage: true,
  setUseSystemLanguage: () => {},
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [useSystemLanguage, setUseSystemLanguage] = useState(true);

  // Effect to handle system language preference
  useEffect(() => {
    // Check if there's a stored language preference
    const storedLanguage = localStorage.getItem('userLanguagePreference');
    const useSystemLang = localStorage.getItem('useSystemLanguage');
    
    if (storedLanguage && useSystemLang === 'false') {
      // User has a specific language preference
      setUseSystemLanguage(false);
      setCurrentLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    } else {
      // Use browser language or fall back to default
      setUseSystemLanguage(true);
      // i18next-browser-languagedetector will handle this automatically
    }
  }, [i18n]);

  // Function to change language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('userLanguagePreference', lang);
    
    if (!useSystemLanguage) {
      localStorage.setItem('useSystemLanguage', 'false');
    }
  };

  // Function to toggle system language usage
  const handleSetUseSystemLanguage = (use: boolean) => {
    setUseSystemLanguage(use);
    localStorage.setItem('useSystemLanguage', use.toString());
    
    if (use) {
      // Reset to browser language
      const detectedLanguage = navigator.language.split('-')[0];
      const supportedLanguage = ['en', 'fr', 'de'].includes(detectedLanguage) ? detectedLanguage : 'en';
      i18n.changeLanguage(supportedLanguage);
      setCurrentLanguage(supportedLanguage);
    } else {
      // Keep current language as user preference
      localStorage.setItem('userLanguagePreference', currentLanguage);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        useSystemLanguage,
        setUseSystemLanguage: handleSetUseSystemLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
