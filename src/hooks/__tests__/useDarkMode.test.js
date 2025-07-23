import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../useDarkMode';
import {
  getInitialDarkMode,
  saveDarkModePreference,
  applyDarkModeToBody,
} from '../../utils/darkModeUtils';

// Mock the darkModeUtils
jest.mock('../../utils/darkModeUtils', () => ({
  getInitialDarkMode: jest.fn(() => false),
  saveDarkModePreference: jest.fn(),
  applyDarkModeToBody: jest.fn(),
}));

describe('useDarkMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the result of getInitialDarkMode', () => {
    getInitialDarkMode.mockReturnValue(true);
    
    const { result } = renderHook(() => useDarkMode());
    
    expect(result.current.isDarkMode).toBe(true);
    expect(getInitialDarkMode).toHaveBeenCalledTimes(1);
  });

  it('should apply dark mode to body on initialization', () => {
    getInitialDarkMode.mockReturnValue(true);
    
    renderHook(() => useDarkMode());
    
    expect(applyDarkModeToBody).toHaveBeenCalledWith(true);
  });

  it('should toggle dark mode when toggleDarkMode is called', () => {
    getInitialDarkMode.mockReturnValue(false);
    
    const { result } = renderHook(() => useDarkMode());
    
    expect(result.current.isDarkMode).toBe(false);
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(result.current.isDarkMode).toBe(true);
    expect(saveDarkModePreference).toHaveBeenCalledWith(true);
    expect(applyDarkModeToBody).toHaveBeenCalledWith(true);
  });

  it('should save preference and apply to body when toggling', () => {
    getInitialDarkMode.mockReturnValue(true);
    
    const { result } = renderHook(() => useDarkMode());
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(result.current.isDarkMode).toBe(false);
    expect(saveDarkModePreference).toHaveBeenCalledWith(false);
    expect(applyDarkModeToBody).toHaveBeenCalledWith(false);
  });

  it('should apply dark mode to body whenever isDarkMode changes', () => {
    getInitialDarkMode.mockReturnValue(false);
    
    const { result } = renderHook(() => useDarkMode());
    
    // Clear initial calls
    jest.clearAllMocks();
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(applyDarkModeToBody).toHaveBeenCalledWith(true);
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(applyDarkModeToBody).toHaveBeenCalledWith(false);
  });
}); 