/**
 * Dark mode utility functions
 */

/**
 * Gets the initial dark mode preference from localStorage or system preference
 * @returns {boolean} Initial dark mode state
 */
export const getInitialDarkMode = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme !== null) {
    return JSON.parse(savedTheme);
  }
  // Fall back to system preference
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) || false;
};

/**
 * Saves dark mode preference to localStorage
 * @param {boolean} isDarkMode - The dark mode state to save
 */
export const saveDarkModePreference = (isDarkMode) => {
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
};

/**
 * Applies dark mode class to document body
 * @param {boolean} isDarkMode - Whether to apply dark mode
 */
export const applyDarkModeToBody = (isDarkMode) => {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}; 