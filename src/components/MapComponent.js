import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Function to calculate the centroid of a polygon
const calculateCentroid = (geometry) => {
  try {
    let coordinates = geometry.coordinates;
    
    // Handle MultiPolygon - use the first (usually largest) polygon
    if (geometry.type === 'MultiPolygon') {
      coordinates = coordinates[0];
    }
    
    // Get the outer ring of the polygon (first array in coordinates)
    const ring = coordinates[0];
    
    if (!ring || ring.length === 0) {
      console.warn('Empty ring in polygon');
      return null;
    }
    
    let totalLat = 0, totalLng = 0;
    let validPoints = 0;
    
    // Sum all coordinate points (excluding the last point which duplicates the first)
    for (let i = 0; i < ring.length - 1; i++) {
      if (ring[i] && ring[i].length >= 2) {
        totalLng += ring[i][0]; // longitude is first in GeoJSON
        totalLat += ring[i][1]; // latitude is second in GeoJSON
        validPoints++;
      }
    }
    
    if (validPoints === 0) {
      console.warn('No valid points found in polygon');
      return null;
    }
    
    // Return [lat, lng] format for Leaflet
    return [totalLat / validPoints, totalLng / validPoints];
  } catch (error) {
    console.error('Error calculating centroid:', error);
    return null;
  }
};

// Fallback coordinates for ZIP codes
const FALLBACK_COORDINATES = {
  '98101': [47.6062, -122.3321],
  '98102': [47.6308, -122.3222],
  '98103': [47.6769, -122.3419],
  '98104': [47.6020, -122.3311],
  '98105': [47.6617, -122.3006],
  '98106': [47.5319, -122.3433],
  '98107': [47.6683, -122.3761],
  '98108': [47.5322, -122.3158],
  '98109': [47.6244, -122.3517],
  '98112': [47.6342, -122.3022],
  '98115': [47.6847, -122.3006],
  '98116': [47.5694, -122.3867],
  '98117': [47.6883, -122.3867],
  '98118': [47.5411, -122.2639],
  '98119': [47.6358, -122.3597],
  '98121': [47.6133, -122.3444],
  '98122': [47.6019, -122.3069],
  '98125': [47.7267, -122.3017],
  '98126': [47.5333, -122.3733],
  '98133': [47.7336, -122.3439],
  '98134': [47.5844, -122.3256],
  '98136': [47.5267, -122.3681],
  '98144': [47.5847, -122.2950],
  '98146': [47.4889, -122.3431],
  '98155': [47.7553, -122.3000],
  '98168': [47.4811, -122.2928],
  '98177': [47.7336, -122.3758],
  '98178': [47.5019, -122.2417],
  '98199': [47.6564, -122.4089]
};

const MapComponent = ({ zipCodeData, selectedSpecies }) => {
  const [mapCenter] = useState([47.6062, -122.3321]); // Seattle center
  const [mapZoom] = useState(11);
  const [zipBoundaries, setZipBoundaries] = useState(null);
  const [zipCentroids, setZipCentroids] = useState({});

  // Load ZIP code boundaries
  useEffect(() => {
    fetch('/seattle_zip_boundaries.geojson')
      .then(response => response.json())
      .then(data => {
        setZipBoundaries(data);
        
        // Calculate centroids for each ZIP code
        const centroids = {};
        data.features.forEach(feature => {
          const zipCode = feature.properties.ZCTA5CE10;
          if (feature.geometry) {
            const centroid = calculateCentroid(feature.geometry);
            if (centroid) {
              centroids[zipCode] = centroid;
            }
          }
        });
        console.log('Calculated centroids for ZIP codes:', Object.keys(centroids));
        setZipCentroids(centroids);
      })
      .catch(error => {
        console.error('Error loading ZIP boundaries:', error);
      });
  }, []);

  // Function to get circle color based on species (improved contrast and distinction)
  const getCircleColor = (species) => {
    switch (species) {
      case 'Dog': return '#e74c3c';    // Vibrant red
      case 'Cat': return '#3498db';    // Bright blue  
      case 'Goat': return '#f39c12';   // Orange
      case 'Pig': return '#9b59b6';    // Purple
      default: return '#95a5a6';       // Gray for unknown
    }
  };

  // Function to calculate circle radius based on count
  const getCircleRadius = (count) => {
    const maxRadius = 30;
    const minRadius = 5;
    const maxCount = Math.max(...zipCodeData.map(item => item.count));
    return Math.max(minRadius, (count / maxCount) * maxRadius);
  };

  // Filter zip codes that have calculated centroids or fallback coordinates
  const mappableData = zipCodeData.filter(item => {
    const hasPosition = zipCentroids[item.zipCode] || FALLBACK_COORDINATES[item.zipCode];
    return hasPosition;
  });
  
  console.log(`Mappable data count: ${mappableData.length}`, 
    `Centroids available: ${Object.keys(zipCentroids).length}`);

  return (
    <div className="map-container">
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
          <p>Circle size represents the number of licenses</p>
        </div>
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
                
                layer.bindPopup(`
                  <div>
                    <h4>ZIP Code: ${zipCode}</h4>
                    ${zipData ? 
                      `<p><strong>Pet Licenses: ${zipData.count}</strong></p>` : 
                      '<p>No pet license data</p>'
                    }
                  </div>
                `);
              }
            }}
          />
        )}
        
        {mappableData.map((item) => {
          // Use calculated centroid if available, otherwise use fallback coordinates
          const position = zipCentroids[item.zipCode] || FALLBACK_COORDINATES[item.zipCode];
          const radius = getCircleRadius(item.count);
          
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
                  <p><strong>Total Licenses: {item.count}</strong></p>
                  {Object.entries(speciesGroups).map(([species, pets]) => (
                    <p key={species}>
                      {species}: {pets.length} 
                      ({((pets.length / item.count) * 100).toFixed(1)}%)
                    </p>
                  ))}
                  <hr />
                  <p><em>Most common names:</em></p>
                  {Object.entries(speciesGroups).map(([species, pets]) => {
                    const nameCount = pets.reduce((acc, pet) => {
                      const name = pet["Animal's Name"];
                      if (name && name.trim()) {
                        acc[name] = (acc[name] || 0) + 1;
                      }
                      return acc;
                    }, {});
                    
                    const topNames = Object.entries(nameCount)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([name, count]) => `${name} (${count})`)
                      .join(', ');
                    
                    return topNames ? (
                      <p key={species} className="popular-names">
                        {species}: {topNames}
                      </p>
                    ) : null;
                  })}
                </div>
              </Popup>
            </CircleMarker>
                      );
          }).filter(Boolean)}
        </MapContainer>
      
      <div className="map-stats">
        <h3>Statistics</h3>
        <p>ZIP Codes with data: {mappableData.length}</p>
        <p>Total licenses shown: {zipCodeData.reduce((sum, item) => sum + item.count, 0)}</p>
        <p>Viewing: {selectedSpecies === 'All' ? 'All Species' : selectedSpecies}</p>
      </div>
    </div>
  );
};

export default MapComponent;