import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MapComponent from './components/MapComponent';
import FilterComponent from './components/FilterComponent';
import './App.css';

function App() {
  const [petData, setPetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load CSV data
    Papa.parse('/Seattle_Pet_Licenses_20250714.csv', {
      download: true,
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file');
          console.error('CSV parsing errors:', results.errors);
        } else {
          // Clean the data - filter out invalid entries
          const cleanData = results.data.filter(row => 
            row['ZIP Code'] && 
            row['Species'] && 
            row['ZIP Code'].trim() !== '' && 
            row['Species'].trim() !== '' &&
            ['Dog', 'Cat', 'Goat', 'Pig'].includes(row['Species'].trim())
          );
          
          setPetData(cleanData);
          setFilteredData(cleanData);
          setLoading(false);
        }
      },
      error: (error) => {
        setError('Error loading CSV file');
        console.error('CSV loading error:', error);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    // Filter data based on selected species
    if (selectedSpecies === 'All') {
      setFilteredData(petData);
    } else {
      setFilteredData(petData.filter(row => row['Species'] === selectedSpecies));
    }
  }, [petData, selectedSpecies]);

  // Group data by ZIP code and count licenses
  const groupedData = filteredData.reduce((acc, row) => {
    const zipCode = row['ZIP Code'].trim();
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
  const uniqueSpecies = [...new Set(petData.map(row => row['Species']))].sort();

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Seattle Pet Licenses Map</h1>
          <p>Loading data...</p>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Seattle Pet Licenses Map</h1>
          <p>Error: {error}</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Seattle Pet Licenses Map</h1>
        <p>Visualizing {filteredData.length} pet licenses across Seattle ZIP codes</p>
      </header>
      
      <FilterComponent 
        species={uniqueSpecies}
        selectedSpecies={selectedSpecies}
        onSpeciesChange={setSelectedSpecies}
      />
      
      <MapComponent 
        zipCodeData={zipCodeData}
        selectedSpecies={selectedSpecies}
      />
    </div>
  );
}

export default App;