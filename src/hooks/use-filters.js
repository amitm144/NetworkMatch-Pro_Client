// hooks/use-filters.js
import { useState } from 'react';

export function useFilters(initialFilters = {}) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [companyFilter, setCompanyFilter] = useState(initialFilters.company || 'all');
  const [locationFilter, setLocationFilter] = useState(initialFilters.location || 'all');

  return {
    // Current values
    searchTerm,
    companyFilter,
    locationFilter,
    
    // Setters
    setSearchTerm,
    setCompanyFilter,
    setLocationFilter,
    
    // Combined filters object
    filters: {
      searchTerm,
      company: companyFilter,
      location: locationFilter
    }
  };
}