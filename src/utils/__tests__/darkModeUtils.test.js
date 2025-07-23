import { 
  getInitialDarkMode, 
  saveDarkModePreference, 
  applyDarkModeToBody 
} from '../darkModeUtils';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('darkModeUtils', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    document.body.className = '';
  });

  describe('getInitialDarkMode', () => {
    it('should return saved preference from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('true');
      expect(getInitialDarkMode()).toBe(true);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('darkMode');
    });

    it('should return false when localStorage has false', () => {
      mockLocalStorage.getItem.mockReturnValue('false');
      expect(getInitialDarkMode()).toBe(false);
    });

    it('should fallback to system preference when no localStorage value', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      expect(getInitialDarkMode()).toBe(true);
    });

    it('should return false when no system preference available', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      window.matchMedia = undefined;
      expect(getInitialDarkMode()).toBe(false);
    });
  });

  describe('saveDarkModePreference', () => {
    it('should save dark mode preference to localStorage', () => {
      saveDarkModePreference(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('should save light mode preference to localStorage', () => {
      saveDarkModePreference(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    });
  });

  describe('applyDarkModeToBody', () => {
    it('should add dark-mode class when dark mode is enabled', () => {
      applyDarkModeToBody(true);
      expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    it('should remove dark-mode class when dark mode is disabled', () => {
      document.body.classList.add('dark-mode');
      applyDarkModeToBody(false);
      expect(document.body.classList.contains('dark-mode')).toBe(false);
    });
  });
}); 