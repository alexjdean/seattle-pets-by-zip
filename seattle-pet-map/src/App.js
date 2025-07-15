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
  const [dataInfo, setDataInfo] = useState(null);

  useEffect(() => {
    // Load CSV data
    Papa.parse('/Seattle_Pet_Licenses_20250714.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        console.log('CSV parsing complete:', results);
        
        // Filter out rows with parsing errors or missing critical data
        const validData = results.data.filter(row => {
          // Check if row has the essential fields
          return (
            row &&
            row['ZIP Code'] && 
            row['Species'] && 
            row['License Issue Date'] &&
            row['ZIP Code'].toString().trim() !== '' && 
            row['Species'].toString().trim() !== '' &&
            ['Dog', 'Cat', 'Goat', 'Pig'].includes(row['Species'].toString().trim()) &&
            // Validate ZIP code format (should be 5 digits)
            /^\d{5}$/.test(row['ZIP Code'].toString().trim())
          );
        });

        const invalidRows = results.data.length - validData.length;
        console.log(`Filtered data: ${validData.length} valid rows out of ${results.data.length} total rows`);
        
        if (validData.length === 0) {
          setError('No valid data found in CSV file');
        } else {
          setPetData(validData);
          setFilteredData(validData);
          setDataInfo({
            totalRows: results.data.length,
            validRows: validData.length,
            invalidRows: invalidRows,
            species: [...new Set(validData.map(row => row['Species']))].sort()
          });
        }
        
        setLoading(false);
      },
      error: (error) => {
        console.error('CSV loading error:', error);
        setError('Error loading CSV file: ' + error.message);
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
    const zipCode = row['ZIP Code'].toString().trim();
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
          <p>Loading and processing pet license data...</p>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Please wait while we load the data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Seattle Pet Licenses Map</h1>
          <p>Error occurred while loading data</p>
        </header>
        <div className="error-container">
          <h3>❌ Error Loading Data</h3>
          <p>{error}</p>
          <p>Please check:</p>
          <ul style={{ textAlign: 'left' }}>
            <li>Your internet connection</li>
            <li>That the CSV file is accessible</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Seattle Pet Licenses Map</h1>
        <p>Visualizing {filteredData.length} pet licenses across Seattle ZIP codes</p>
      </header>
      
      {dataInfo && (
        <div className="success-info">
          <strong>✅ Data loaded successfully!</strong><br />
          Processed {dataInfo.validRows.toLocaleString()} valid records from {dataInfo.totalRows.toLocaleString()} total rows
          {dataInfo.invalidRows > 0 && (
            <span> ({dataInfo.invalidRows.toLocaleString()} invalid rows filtered out)</span>
          )}
        </div>
      )}
      
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