import { useState, useEffect } from 'react';
import { fetchZipBoundaries, calculateZipCentroids } from '../utils/geoUtils';

/**
 * Custom hook for managing map-related data (boundaries and centroids)
 * @returns {Object} Object containing map data and loading state
 */
export const useMapData = () => {
  const [zipBoundaries, setZipBoundaries] = useState(null);
  const [zipCentroids, setZipCentroids] = useState({});
  const [centroidsLoaded, setCentroidsLoaded] = useState(false);

  // Load ZIP code boundaries and calculate centroids
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const boundaryData = await fetchZipBoundaries();
        setZipBoundaries(boundaryData);
        
        const centroids = calculateZipCentroids(boundaryData);
        setZipCentroids(centroids);
        setCentroidsLoaded(true);
      } catch (error) {
        console.error('Error loading map data:', error);
        setCentroidsLoaded(true); // Still set to true to allow fallback coordinates
      }
    };

    loadMapData();
  }, []);

  return {
    zipBoundaries,
    zipCentroids,
    centroidsLoaded
  };
}; 