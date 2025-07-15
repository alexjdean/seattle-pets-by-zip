import React from 'react';
import './FilterComponent.css';

const FilterComponent = ({ species, selectedSpecies, onSpeciesChange }) => {
  return (
    <div className="filter-container">
      <h3>Filter by Species</h3>
      <div className="filter-buttons">
        <button 
          className={selectedSpecies === 'All' ? 'active' : ''}
          onClick={() => onSpeciesChange('All')}
        >
          All Species
        </button>
        {species.map(speciesName => (
          <button
            key={speciesName}
            className={selectedSpecies === speciesName ? 'active' : ''}
            onClick={() => onSpeciesChange(speciesName)}
          >
            {speciesName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterComponent;