/**
 * Map utility functions
 */

/**
 * Gets the color for a species circle
 * @param {string} species - The species name
 * @returns {string} Hex color code
 */
export const getCircleColor = (species) => {
  const colorMap = {
    'Dog': '#e74c3c',
    'Cat': '#3498db',
    'Goat': '#f39c12',
    'Pig': '#9b59b6'
  };
  return colorMap[species] || '#95a5a6';
};

/**
 * Calculates circle radius based on count
 * @param {number} count - Number of licenses
 * @param {number} maxCount - Maximum count in dataset
 * @returns {number} Radius in pixels
 */
export const getCircleRadius = (count, maxCount) => {
  const maxRadius = 30;
  const minRadius = 5;
  return Math.max(minRadius, (count / maxCount) * maxRadius);
};

/**
 * Gets top pet names from a list of pets
 * @param {Array} pets - Array of pet objects
 * @param {number} count - Number of top names to return (default: 3)
 * @returns {string} Comma-separated list of top names with counts
 */
export const getTopNames = (pets, count = 3) => {
  if (!pets || pets.length === 0) return '';
  
  const nameCount = pets.reduce((acc, pet) => {
    const name = pet.Name;
    if (name && name.trim()) {
      acc[name] = (acc[name] || 0) + 1;
    }
    return acc;
  }, {});
  
  return Object.entries(nameCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, count)
    .map(([name, count]) => `${name} (${count})`)
    .join(', ');
};

/**
 * Filters mappable data based on available coordinates
 * @param {Array} zipCodeData - Array of ZIP code data objects
 * @param {Object} zipCentroids - Object mapping ZIP codes to centroids
 * @param {Object} fallbackCoordinates - Fallback coordinates object
 * @returns {Array} Filtered array of mappable data
 */
export const getMappableData = (zipCodeData, zipCentroids, fallbackCoordinates) => {
  if (!zipCodeData) return [];
  
  return zipCodeData.filter(item => {
    const hasPosition = zipCentroids[item.zipCode] || fallbackCoordinates[item.zipCode];
    return hasPosition;
  });
}; 