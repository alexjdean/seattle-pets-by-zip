/**
 * Geographic utility functions
 */

// Fallback coordinates for ZIP codes
export const FALLBACK_COORDINATES = {
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

/**
 * Calculates the centroid of a polygon geometry
 * @param {Object} geometry - GeoJSON geometry object
 * @returns {Array|null} [lat, lng] coordinates or null if calculation fails
 */
export const calculateCentroid = (geometry) => {
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

/**
 * Fetches ZIP code boundary data
 * @returns {Promise<Object>} Promise that resolves to GeoJSON data
 */
export const fetchZipBoundaries = async () => {
  const response = await fetch('./seattle_zip_boundaries.geojson');
  return response.json();
};

/**
 * Calculates centroids for all ZIP codes in boundary data
 * @param {Object} boundaryData - GeoJSON boundary data
 * @returns {Object} Object mapping ZIP codes to centroid coordinates
 */
export const calculateZipCentroids = (boundaryData) => {
  const centroids = {};
  
  if (!boundaryData?.features) return centroids;
  
  boundaryData.features.forEach(feature => {
    const zipCode = feature.properties.ZCTA5CE10;
    if (feature.geometry) {
      const centroid = calculateCentroid(feature.geometry);
      if (centroid) {
        centroids[zipCode] = centroid;
      }
    }
  });
  
  return centroids;
}; 