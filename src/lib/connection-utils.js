// src/utils/connection-utils.js

/**
 * Filter connections based on search criteria
 * @param {Array} connections - Array of connection objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered connections
 */
export const filterConnections = (connections, filters) => {
  // Ensure connections is an array
  if (!Array.isArray(connections)) {
    console.warn('filterConnections received non-array input:', connections);
    return [];
  }

  const { searchTerm, company } = filters;

  return connections.filter(connection => {
    if (!connection) return false;

    const matchesSearch = !searchTerm || 
      connection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany = !company || 
      company === 'all' || 
      connection.company === company;

    return matchesSearch && matchesCompany;
  });
};

/**
 * Get unique companies from connections
 * @param {Array} connections - Array of connection objects
 * @returns {Array} Array of unique company names
 */
export const getUniqueCompanies = (connections) => {
  if (!Array.isArray(connections)) return [];
  
  return [...new Set(
    connections
      .map(conn => conn?.company)
      .filter(Boolean)
  )].sort();
};

/**
 * Group connections by company
 * @param {Array} connections - Array of connection objects
 * @returns {Object} Grouped connections
 */
export const groupByCompany = (connections) => {
  if (!Array.isArray(connections)) return {};

  return connections.reduce((groups, connection) => {
    if (!connection?.company) return groups;
    
    const company = connection.company;
    if (!groups[company]) {
      groups[company] = [];
    }
    groups[company].push(connection);
    return groups;
  }, {});
};

/**
 * Calculate connection statistics
 * @param {Array} connections - Array of connection objects
 * @returns {Object} Statistics object
 */
export const calculateStats = (connections) => {
  if (!Array.isArray(connections)) return {
    total: 0,
    companies: 0,
    locations: 0
  };

  const companies = new Set();
  const locations = new Set();

  connections.forEach(conn => {
    if (conn?.company) companies.add(conn.company);
    if (conn?.location) locations.add(conn.location);
  });

  return {
    total: connections.length,
    companies: companies.size,
    locations: locations.size
  };
};