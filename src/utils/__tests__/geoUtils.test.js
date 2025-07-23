import { 
  calculateCentroid, 
  calculateZipCentroids, 
  FALLBACK_COORDINATES 
} from '../geoUtils';

describe('geoUtils', () => {
  describe('FALLBACK_COORDINATES', () => {
    it('should contain Seattle ZIP codes with coordinates', () => {
      expect(FALLBACK_COORDINATES['98101']).toEqual([47.6062, -122.3321]);
      expect(FALLBACK_COORDINATES['98102']).toEqual([47.6308, -122.3222]);
      expect(FALLBACK_COORDINATES['98199']).toEqual([47.6564, -122.4089]);
    });

    it('should have coordinates in [lat, lng] format', () => {
      Object.values(FALLBACK_COORDINATES).forEach(coords => {
        expect(coords).toHaveLength(2);
        expect(typeof coords[0]).toBe('number'); // latitude
        expect(typeof coords[1]).toBe('number'); // longitude
        expect(coords[0]).toBeGreaterThan(47); // Seattle latitude range
        expect(coords[0]).toBeLessThan(48);
        expect(coords[1]).toBeGreaterThan(-123); // Seattle longitude range
        expect(coords[1]).toBeLessThan(-122);
      });
    });
  });

  describe('calculateCentroid', () => {
    const mockPolygon = {
      type: 'Polygon',
      coordinates: [[
        [-122.3, 47.6],
        [-122.2, 47.6],
        [-122.2, 47.7],
        [-122.3, 47.7],
        [-122.3, 47.6] // Closing point
      ]]
    };

    const mockMultiPolygon = {
      type: 'MultiPolygon',
      coordinates: [[[
        [-122.3, 47.6],
        [-122.2, 47.6],
        [-122.2, 47.7],
        [-122.3, 47.7],
        [-122.3, 47.6]
      ]]]
    };

    it('should calculate centroid for a simple polygon', () => {
      const result = calculateCentroid(mockPolygon);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeCloseTo(47.65, 1); // latitude
      expect(result[1]).toBeCloseTo(-122.25, 1); // longitude
    });

    it('should handle MultiPolygon by using the first polygon', () => {
      const result = calculateCentroid(mockMultiPolygon);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeCloseTo(47.65, 1);
      expect(result[1]).toBeCloseTo(-122.25, 1);
    });

    it('should return null for empty ring', () => {
      const emptyPolygon = {
        type: 'Polygon',
        coordinates: [[]]
      };
      expect(calculateCentroid(emptyPolygon)).toBeNull();
    });

    it('should return null for invalid geometry', () => {
      expect(calculateCentroid(null)).toBeNull();
      expect(calculateCentroid({})).toBeNull();
    });

    it('should handle invalid coordinates gracefully', () => {
      const invalidPolygon = {
        type: 'Polygon',
        coordinates: [[
          [-122.2, 47.7],
          [-122.3, 47.8],
          [-122.2, 47.7] // Valid coordinates only
        ]]
      };
      const result = calculateCentroid(invalidPolygon);
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
    });

    it('should return null when no valid points found', () => {
      const invalidPolygon = {
        type: 'Polygon',
        coordinates: [[]] // Empty coordinates array
      };
      expect(calculateCentroid(invalidPolygon)).toBeNull();
    });
  });

  describe('calculateZipCentroids', () => {
    const mockBoundaryData = {
      features: [
        {
          properties: { ZCTA5CE10: '98101' },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-122.3, 47.6],
              [-122.2, 47.6],
              [-122.2, 47.7],
              [-122.3, 47.7],
              [-122.3, 47.6]
            ]]
          }
        },
        {
          properties: { ZCTA5CE10: '98102' },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-122.4, 47.5],
              [-122.3, 47.5],
              [-122.3, 47.6],
              [-122.4, 47.6],
              [-122.4, 47.5]
            ]]
          }
        },
        {
          properties: { ZCTA5CE10: '98103' },
          geometry: null // Invalid geometry
        }
      ]
    };

    it('should calculate centroids for all valid ZIP codes', () => {
      const result = calculateZipCentroids(mockBoundaryData);
      
      expect(result['98101']).toHaveLength(2);
      expect(result['98101'][0]).toBeCloseTo(47.65, 1);
      expect(result['98101'][1]).toBeCloseTo(-122.25, 1);
      
      expect(result['98102']).toHaveLength(2);
      expect(result['98102'][0]).toBeCloseTo(47.55, 1);
      expect(result['98102'][1]).toBeCloseTo(-122.35, 1);
    });

    it('should skip ZIP codes with invalid geometry', () => {
      const result = calculateZipCentroids(mockBoundaryData);
      expect(result['98103']).toBeUndefined();
    });

    it('should handle empty or invalid boundary data', () => {
      expect(calculateZipCentroids(null)).toEqual({});
      expect(calculateZipCentroids({})).toEqual({});
      expect(calculateZipCentroids({ features: [] })).toEqual({});
    });

    it('should handle missing features array', () => {
      const invalidData = { type: 'FeatureCollection' };
      expect(calculateZipCentroids(invalidData)).toEqual({});
    });
  });
}); 