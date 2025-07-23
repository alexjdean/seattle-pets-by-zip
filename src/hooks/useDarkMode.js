import { useState, useEffect } from 'react';
import { 
  getInitialDarkMode, 
  saveDarkModePreference, 
  applyDarkModeToBody 
} from '../utils/darkModeUtils';

/**
 * Custom hook for managing dark mode state
 * @returns {Object} Object containing isDarkMode state and toggleDarkMode function
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  // Handle dark mode toggle with localStorage persistence
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    saveDarkModePreference(newDarkMode);
  };

  // Apply dark mode class to body when state changes
  useEffect(() => {
    applyDarkModeToBody(isDarkMode);
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
}; 