import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import FilterComponent from './components/FilterComponent';
import './App.css';

function App() {
  const [petData, setPetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Load preprocessed JSON data for fastest performance
    fetch('/pets_clean_v2.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data loaded successfully:', data.length, 'records');

        setPetData(data);
        setFilteredData(data);

        // Get unique species for the filter
        const speciesSet = new Set(data.map(row => row['Species']));
        const uniqueSpecies = Array.from(speciesSet).sort();
        
        setDataInfo({
          totalRecords: data.length,
          species: uniqueSpecies
        });

        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setError('Error loading pet data: ' + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter data based on selected species
    if (selectedSpecies === 'All') {
      setFilteredData(petData);
    } else {
      const filtered = petData.filter(row => row['Species'] === selectedSpecies);
      setFilteredData(filtered);
    }
  }, [petData, selectedSpecies]);

  // Group data by ZIP code and count licenses
  const groupedData = filteredData.reduce((acc, row) => {
    const zipCode = row['ZIP Code'];
    if (!acc[zipCode]) {
      acc[zipCode] = {
        zipCode,
        count: 0,
        pets: []
      };
    }
    acc[zipCode].count += 1;
    acc[zipCode].pets.push(row);
    return acc;
  }, {});

  const zipCodeData = Object.values(groupedData);

  // Get unique species for filter
  const uniqueSpecies = dataInfo ? dataInfo.species : [];

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
                onClick={() => setIsDarkMode(!isDarkMode)}
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
                onClick={() => setIsDarkMode(!isDarkMode)}
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
            <h1>Seattle Pet Licenses Map</h1>
            <p>Visualizing {petData.length.toLocaleString()} pet licenses across Seattle ZIP codes</p>
          </div>
          <div className="header-controls">
            <button 
              className="dark-mode-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? 'Prefer light mode?' : 'Prefer dark mode?'}
            </button>
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
