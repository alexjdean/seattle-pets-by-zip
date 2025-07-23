/**
 * Data processing utility functions
 */

/**
 * Fetches and parses pet data from JSON file
 * @returns {Promise<Array>} Promise that resolves to pet data array
 */
export const fetchPetData = async () => {
  const response = await fetch('./pets_clean_v2.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Gets unique species from pet data
 * @param {Array} petData - Array of pet records
 * @returns {Array} Sorted array of unique species names
 */
export const getUniqueSpecies = (petData) => {
  if (!petData || petData.length === 0) return [];
  return Array.from(new Set(petData.map(row => row['Species']))).sort();
};

/**
 * Filters pet data by selected species
 * @param {Array} petData - Array of pet records
 * @param {string} selectedSpecies - Selected species ('All' for no filter)
 * @returns {Array} Filtered pet data
 */
export const filterDataBySpecies = (petData, selectedSpecies) => {
  if (!petData) return [];
  if (selectedSpecies === 'All') return petData;
  return petData.filter(row => row['Species'] === selectedSpecies);
};

/**
 * Groups filtered data by ZIP code with counts and pet lists
 * @param {Array} filteredData - Filtered pet data
 * @returns {Array} Array of ZIP code objects with counts and pet lists
 */
export const groupDataByZipCode = (filteredData) => {
  if (!filteredData) return [];
  
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

  return Object.values(groupedData);
}; 