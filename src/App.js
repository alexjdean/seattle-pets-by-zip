import React from 'react';
import MapComponent from './components/MapComponent';
import FilterComponent from './components/FilterComponent';
import { useDarkMode } from './hooks/useDarkMode';
import { usePetData } from './hooks/usePetData';
import './App.css';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { 
    petData, 
    selectedSpecies, 
    setSelectedSpecies, 
    loading, 
    error, 
    uniqueSpecies, 
    zipCodeData 
  } = usePetData();

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Seattle Pet Licenses Map</h1>
              <p>Loading pet license data...</p>
            </div>
            <div className="header-controls">
              <button 
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? 'Prefer light mode?' : 'Prefer dark mode?'}
              </button>
            </div>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Seattle Pet Licenses Map</h1>
              <p>Error occurred while loading data</p>
            </div>
            <div className="header-controls">
              <button 
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? 'Prefer light mode?' : 'Prefer dark mode?'}
              </button>
            </div>
          </div>
        </header>
        <div className="error-container">
          <h3>❌ Error Loading Data</h3>
          <p>{error}</p>
          <p>Please check:</p>
          <ul style={{ textAlign: 'left' }}>
            <li>Your internet connection</li>
            <li>That the data file is accessible</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-text">
            <div className="header-text-content">
              <h1>Seattle Pet Licenses Map</h1>
              <p>Visualizing {petData.length.toLocaleString()} pet licenses across Seattle ZIP codes</p>
            </div>
            <div className="mobile-dark-toggle">
              <button 
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? 'Prefer light mode?' : 'Prefer dark mode?'}
              </button>
            </div>
          </div>
          <div className="header-controls">
            <div className="desktop-dark-toggle">
              <button 
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? 'Prefer light mode?' : 'Prefer dark mode?'}
              </button>
            </div>
            <FilterComponent 
              species={uniqueSpecies}
              selectedSpecies={selectedSpecies}
              onSpeciesChange={setSelectedSpecies}
            />
          </div>
        </div>
      </header>
      <MapComponent 
        zipCodeData={zipCodeData}
        selectedSpecies={selectedSpecies}
      />
    </div>
  );
}

export default App;
