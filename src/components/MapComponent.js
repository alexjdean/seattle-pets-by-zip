import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapData } from '../hooks/useMapData';
import { FALLBACK_COORDINATES } from '../utils/geoUtils';
import { getTopNames, getCircleColor, getCircleRadius, getMappableData } from '../utils/mapUtils';
import './MapComponent.css';

const MapComponent = ({ zipCodeData, selectedSpecies }) => {  
  const [mapCenter] = useState([47.6062, -122.3321]); // Seattle center
  const [mapZoom] = useState(11);
  const { zipBoundaries, zipCentroids, centroidsLoaded } = useMapData();

  // Create a key to force GeoJSON re-render when data changes
  const geoJsonKey = `${selectedSpecies}-${zipCodeData.length}`;

  // Calculate max count for radius calculation
  const maxCount = Math.max(...zipCodeData.map(item => item.count));

  // Filter zip codes that have calculated centroids or fallback coordinates
  const mappableData = centroidsLoaded ? getMappableData(zipCodeData, zipCentroids, FALLBACK_COORDINATES) : [];

  return (
    <div className="map-container">
      {/* Mobile top section: legend and stats side by side */}
      <div className="mobile-top-section">
        <div className="map-legend">
          <h3>Legend</h3>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
            <span>Dogs</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
            <span>Cats</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f39c12' }}></div>
            <span>Goats</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#9b59b6' }}></div>
            <span>Pigs</span>
          </div>
          <div className="legend-note">
            <p>Circle size represents licenses</p>
          </div>
        </div>
        
        <div className="map-stats">
          <h3>Statistics</h3>
          <p>ZIP Codes: {mappableData.length}</p>
          <p>Licenses: {zipCodeData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}</p>
          <p>Viewing: {selectedSpecies === 'All' ? 'All' : selectedSpecies}</p>
        </div>
      </div>

      <div className="desktop-sidebar">
        <div className="map-legend desktop-only">
          <h3>Legend</h3>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
            <span>Dogs</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
            <span>Cats</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f39c12' }}></div>
            <span>Goats</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#9b59b6' }}></div>
            <span>Pigs</span>
          </div>
          <div className="legend-note">
            <p>Circle size represents the number of licenses</p>
          </div>
        </div>
        
        <div className="map-stats desktop-only">
          <h3>Statistics</h3>
          <p>ZIP Codes with data: {mappableData.length}</p>
          <p>Total licenses shown: {zipCodeData.reduce((sum, item) => sum + item.count, 0)}</p>
          <p>Viewing: {selectedSpecies === 'All' ? 'All Species' : selectedSpecies}</p>
        </div>
        
        <a 
          href="https://data.seattle.gov/City-Administration/Seattle-Pet-Licenses/jguv-t9rb/"
          target="_blank"
          rel="noopener noreferrer"
          className="data-source-link desktop-only"
        >
          See the data source.
        </a>
        
        <p className="credit-text desktop-only">
          Credit to the City of Seattle Open Data portal for making this project happen.
        </p>
        
        <a 
          href="https://github.com/alexjdean/seattle-pets-by-zip"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link desktop-only"
          aria-label="View source code on GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
      
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* ZIP Code Boundaries */}
        {zipBoundaries && (
          <GeoJSON
            key={geoJsonKey}
            data={zipBoundaries}
            style={{
              color: '#2563eb',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.1,
              fillColor: '#3b82f6'
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.ZCTA5CE10) {
                const zipCode = feature.properties.ZCTA5CE10;
                const zipData = zipCodeData.find(item => item.zipCode === zipCode);
                
                if (zipData) {
                  // Group pets by species for this ZIP code
                  const speciesGroups = zipData.pets.reduce((acc, pet) => {
                    const species = pet.Species;
                    if (!acc[species]) acc[species] = [];
                    acc[species].push(pet);
                    return acc;
                  }, {});

                  // Calculate most common names based on current filter

                  layer.bindPopup(() => {
                    const popupContent = document.createElement('div');
                    popupContent.className = 'popup-content';
                    
                    let popupHTML = `
                      <h4>ZIP Code: ${zipCode}</h4>
                      <p><strong>${selectedSpecies === 'All' ? 'Total' : selectedSpecies} Licenses: ${zipData.count.toLocaleString()}</strong></p>
                    `;
                    
                    // Show species breakdown if viewing all species
                    if (selectedSpecies === 'All' && Object.keys(speciesGroups).length > 1) {
                      popupHTML += `
                        <hr />
                        <p><strong>Species Breakdown:</strong></p>
                        ${Object.entries(speciesGroups)
                          .sort(([,a], [,b]) => b.length - a.length)
                          .map(([species, pets]) => 
                            `<p style="margin: 2px 0">${species}: ${pets.length.toLocaleString()} (${((pets.length / zipData.count) * 100).toFixed(1)}%)</p>`
                          ).join('')}
                      `;
                    }
                    
                    // Show most common names based on current filter
                    let petsToAnalyze = [];
                    if (selectedSpecies === 'All') {
                      petsToAnalyze = zipData.pets;
                    } else if (speciesGroups[selectedSpecies]) {
                      petsToAnalyze = speciesGroups[selectedSpecies];
                    }
                    
                    if (petsToAnalyze.length > 0) {
                      const topNames = getTopNames(petsToAnalyze);
                      if (topNames) {
                        popupHTML += `
                          <hr />
                          <p><strong>Most common names:</strong></p>
                                                     <p style="font-style: italic; color: var(--text-secondary);">${topNames}</p>
                        `;
                      }
                    }
                    
                    popupContent.innerHTML = popupHTML;
                    return popupContent;
                  });
                }
              }
            }}
          />
        )}
        
        {mappableData.map((item) => {
          // Use calculated centroid if available, otherwise use fallback coordinates
          const position = zipCentroids[item.zipCode] || FALLBACK_COORDINATES[item.zipCode];
          const radius = getCircleRadius(item.count, maxCount);
          
          // Skip if we don't have a valid position
          if (!position) {
            console.log(`No position found for ZIP code: ${item.zipCode}`);
            return null;
          }
          
          // Group pets by species for this ZIP code
          const speciesGroups = item.pets.reduce((acc, pet) => {
            const species = pet.Species;
            if (!acc[species]) acc[species] = [];
            acc[species].push(pet);
            return acc;
          }, {});
          
          // For mixed species, use a default color or the most common species
          const mostCommonSpecies = Object.keys(speciesGroups).reduce((a, b) => 
            speciesGroups[a].length > speciesGroups[b].length ? a : b
          );
          
          const circleColor = selectedSpecies === 'All' 
            ? getCircleColor(mostCommonSpecies)
            : getCircleColor(selectedSpecies);
          
          return (
            <CircleMarker
              key={item.zipCode}
              center={position}
              radius={radius}
              pathOptions={{
                color: circleColor,
                fillColor: circleColor,
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h4>ZIP Code: {item.zipCode}</h4>
                  <p><strong>{selectedSpecies === 'All' ? 'Total' : selectedSpecies} Licenses: {item.count.toLocaleString()}</strong></p>
                  
                  {selectedSpecies === 'All' && Object.keys(speciesGroups).length > 1 && (
                    <>
                      <hr />
                      <p><strong>Species Breakdown:</strong></p>
                      {Object.entries(speciesGroups)
                        .sort(([,a], [,b]) => b.length - a.length)
                        .map(([species, pets]) => (
                          <p key={species} style={{margin: '2px 0'}}>
                            {species}: {pets.length.toLocaleString()} ({((pets.length / item.count) * 100).toFixed(1)}%)
                          </p>
                        ))}
                    </>
                  )}
                  
                  {(() => {
                    // Determine which pets to analyze for names
                    let petsToAnalyze = [];
                    if (selectedSpecies === 'All') {
                      petsToAnalyze = item.pets;
                    } else if (speciesGroups[selectedSpecies]) {
                      petsToAnalyze = speciesGroups[selectedSpecies];
                    }
                    
                    if (petsToAnalyze.length > 0) {
                      const topNames = getTopNames(petsToAnalyze);
                      if (topNames) {
                        return (
                          <>
                            <hr />
                            <p><strong>Most common names:</strong></p>
                                                         <p style={{fontStyle: 'italic', color: 'var(--text-secondary)'}}>{topNames}</p>
                          </>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              </Popup>
            </CircleMarker>
                      );
                    }).filter(Boolean)}
        </MapContainer>
        
        <a 
          href="https://data.seattle.gov/City-Administration/Seattle-Pet-Licenses/jguv-t9rb/"
          target="_blank"
          rel="noopener noreferrer"
          className="data-source-link mobile-only"
        >
          See the data source.
        </a>
        
        <p className="credit-text mobile-only">
          Credit to the City of Seattle Open Data portal for making this project happen.
        </p>
        
        <a 
          href="https://github.com/alexjdean/seattle-pets-by-zip"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link mobile-only"
          aria-label="View source code on GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>

    </div>
  );
};

export default MapComponent;