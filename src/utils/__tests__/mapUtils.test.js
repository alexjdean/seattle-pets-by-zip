import { 
  getCircleColor, 
  getCircleRadius, 
  getTopNames, 
  getMappableData 
} from '../mapUtils';

describe('mapUtils', () => {
  describe('getCircleColor', () => {
    it('should return correct colors for known species', () => {
      expect(getCircleColor('Dog')).toBe('#e74c3c');
      expect(getCircleColor('Cat')).toBe('#3498db');
      expect(getCircleColor('Goat')).toBe('#f39c12');
      expect(getCircleColor('Pig')).toBe('#9b59b6');
    });

    it('should return default color for unknown species', () => {
      expect(getCircleColor('Bird')).toBe('#95a5a6');
      expect(getCircleColor('')).toBe('#95a5a6');
      expect(getCircleColor(null)).toBe('#95a5a6');
    });
  });

  describe('getCircleRadius', () => {
    it('should calculate radius proportionally', () => {
      expect(getCircleRadius(50, 100)).toBe(15); // (50/100) * 30 = 15
      expect(getCircleRadius(100, 100)).toBe(30); // Maximum radius
      expect(getCircleRadius(0, 100)).toBe(5);   // Minimum radius
    });

    it('should handle edge cases', () => {
      expect(getCircleRadius(1, 100)).toBe(5); // Below minimum, should return minimum
      expect(getCircleRadius(10, 10)).toBe(30); // 100% should return max radius
    });
  });

  describe('getTopNames', () => {
    const mockPets = [
      { Name: 'Buddy' },
      { Name: 'Max' },
      { Name: 'Buddy' },
      { Name: 'Luna' },
      { Name: 'Buddy' },
      { Name: 'Max' },
      { Name: '' }, // Empty name
      { Name: null }, // Null name
    ];

    it('should return top names with counts', () => {
      const result = getTopNames(mockPets, 3);
      expect(result).toBe('Buddy (3), Max (2), Luna (1)');
    });

    it('should limit results to specified count', () => {
      const result = getTopNames(mockPets, 2);
      expect(result).toBe('Buddy (3), Max (2)');
    });

    it('should handle empty or invalid data', () => {
      expect(getTopNames([])).toBe('');
      expect(getTopNames(null)).toBe('');
      expect(getTopNames(undefined)).toBe('');
    });

    it('should ignore empty and null names', () => {
      const petsWithEmptyNames = [
        { Name: 'Buddy' },
        { Name: '' },
        { Name: null },
        { Name: '   ' }, // Whitespace only
      ];
      const result = getTopNames(petsWithEmptyNames);
      expect(result).toBe('Buddy (1)');
    });

    it('should default to 3 names when count not specified', () => {
      const result = getTopNames(mockPets);
      expect(result.split(', ')).toHaveLength(3);
    });
  });

  describe('getMappableData', () => {
    const mockZipCodeData = [
      { zipCode: '98101' },
      { zipCode: '98102' },
      { zipCode: '98103' },
    ];

    const mockCentroids = {
      '98101': [47.6062, -122.3321],
      '98102': [47.6308, -122.3222],
    };

    const mockFallbackCoordinates = {
      '98103': [47.6769, -122.3419],
    };

    it('should return items with available coordinates', () => {
      const result = getMappableData(mockZipCodeData, mockCentroids, mockFallbackCoordinates);
      expect(result).toHaveLength(3);
    });

    it('should filter out items without coordinates', () => {
      const result = getMappableData(mockZipCodeData, mockCentroids, {});
      expect(result).toHaveLength(2);
      expect(result.every(item => ['98101', '98102'].includes(item.zipCode))).toBe(true);
    });

    it('should handle empty data', () => {
      expect(getMappableData(null, mockCentroids, mockFallbackCoordinates)).toEqual([]);
      expect(getMappableData([], mockCentroids, mockFallbackCoordinates)).toEqual([]);
    });

    it('should prefer centroids over fallback coordinates', () => {
      const dataWithOverlap = [{ zipCode: '98101' }];
      const centroidsWithOverlap = { '98101': [1, 1] };
      const fallbackWithOverlap = { '98101': [2, 2] };
      
      const result = getMappableData(dataWithOverlap, centroidsWithOverlap, fallbackWithOverlap);
      expect(result).toHaveLength(1);
    });
  });
}); 