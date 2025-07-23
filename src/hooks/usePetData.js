import { useState, useEffect, useMemo } from 'react';
import { 
  fetchPetData, 
  getUniqueSpecies, 
  filterDataBySpecies, 
  groupDataByZipCode 
} from '../utils/dataUtils';

/**
 * Custom hook for managing pet data state and operations
 * @returns {Object} Object containing pet data, loading state, error, and derived data
 */
export const usePetData = () => {
  const [petData, setPetData] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load pet data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPetData();
        setPetData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading pet data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoized derived data
  const uniqueSpecies = useMemo(() => getUniqueSpecies(petData), [petData]);
  
  const filteredData = useMemo(() => 
    filterDataBySpecies(petData, selectedSpecies), 
    [petData, selectedSpecies]
  );
  
  const zipCodeData = useMemo(() => 
    groupDataByZipCode(filteredData), 
    [filteredData]
  );

  return {
    petData,
    selectedSpecies,
    setSelectedSpecies,
    loading,
    error,
    uniqueSpecies,
    filteredData,
    zipCodeData
  };
}; 