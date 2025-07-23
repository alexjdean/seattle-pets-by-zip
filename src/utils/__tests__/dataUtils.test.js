import { 
  getUniqueSpecies, 
  filterDataBySpecies, 
  groupDataByZipCode 
} from '../dataUtils';

describe('dataUtils', () => {
  const mockPetData = [
    { 'Species': 'Dog', 'ZIP Code': '98101', 'Name': 'Buddy' },
    { 'Species': 'Cat', 'ZIP Code': '98101', 'Name': 'Whiskers' },
    { 'Species': 'Dog', 'ZIP Code': '98102', 'Name': 'Max' },
    { 'Species': 'Cat', 'ZIP Code': '98102', 'Name': 'Luna' },
    { 'Species': 'Goat', 'ZIP Code': '98101', 'Name': 'Billy' },
  ];

  describe('getUniqueSpecies', () => {
    it('should return unique species sorted alphabetically', () => {
      const result = getUniqueSpecies(mockPetData);
      expect(result).toEqual(['Cat', 'Dog', 'Goat']);
    });

    it('should return empty array for empty data', () => {
      expect(getUniqueSpecies([])).toEqual([]);
      expect(getUniqueSpecies(null)).toEqual([]);
      expect(getUniqueSpecies(undefined)).toEqual([]);
    });

    it('should handle duplicate species', () => {
      const dataWithDuplicates = [
        { 'Species': 'Dog' },
        { 'Species': 'Dog' },
        { 'Species': 'Cat' },
      ];
      expect(getUniqueSpecies(dataWithDuplicates)).toEqual(['Cat', 'Dog']);
    });
  });

  describe('filterDataBySpecies', () => {
    it('should return all data when species is "All"', () => {
      const result = filterDataBySpecies(mockPetData, 'All');
      expect(result).toEqual(mockPetData);
    });

    it('should filter data by specific species', () => {
      const result = filterDataBySpecies(mockPetData, 'Dog');
      expect(result).toHaveLength(2);
      expect(result.every(item => item.Species === 'Dog')).toBe(true);
    });

    it('should return empty array for non-existent species', () => {
      const result = filterDataBySpecies(mockPetData, 'Pig');
      expect(result).toEqual([]);
    });

    it('should handle empty data', () => {
      expect(filterDataBySpecies(null, 'Dog')).toEqual([]);
      expect(filterDataBySpecies([], 'Dog')).toEqual([]);
    });
  });

  describe('groupDataByZipCode', () => {
    it('should group data by ZIP code with counts', () => {
      const result = groupDataByZipCode(mockPetData);
      expect(result).toHaveLength(2);
      
      const zip98101 = result.find(item => item.zipCode === '98101');
      expect(zip98101.count).toBe(3);
      expect(zip98101.pets).toHaveLength(3);
      
      const zip98102 = result.find(item => item.zipCode === '98102');
      expect(zip98102.count).toBe(2);
      expect(zip98102.pets).toHaveLength(2);
    });

    it('should handle empty data', () => {
      expect(groupDataByZipCode([])).toEqual([]);
      expect(groupDataByZipCode(null)).toEqual([]);
    });

    it('should include all pets in the pets array', () => {
      const result = groupDataByZipCode(mockPetData);
      const zip98101 = result.find(item => item.zipCode === '98101');
      
      expect(zip98101.pets).toContainEqual(
        expect.objectContaining({ 'Name': 'Buddy', 'Species': 'Dog' })
      );
      expect(zip98101.pets).toContainEqual(
        expect.objectContaining({ 'Name': 'Whiskers', 'Species': 'Cat' })
      );
      expect(zip98101.pets).toContainEqual(
        expect.objectContaining({ 'Name': 'Billy', 'Species': 'Goat' })
      );
    });
  });
}); 