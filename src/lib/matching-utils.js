// src/utils/matching-utils.js

/**
 * Filter matches based on search criteria
 */
export const filterMatches = (matches, filters) => {
    const { searchTerm, company } = filters;
    
    return matches.filter(match => {
      if (!match?.job) return false;
  
      const matchesSearch = !searchTerm || 
        match.job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.company?.toLowerCase().includes(searchTerm.toLowerCase());
  
      const matchesCompany = !company || 
        company === 'all' || 
        match.job.company === company;
  
      return matchesSearch && matchesCompany;
    });
  };
  
  /**
   * Calculate match statistics
   */
  export const calculateMatchStats = (matches) => {
    const stats = {
      totalJobs: matches.length,
      totalConnections: 0,
      companies: new Set(),
      connectionsPerCompany: {},
      connectionStrength: {
        strong: 0,  // > 3 connections
        medium: 0,  // 2-3 connections
        weak: 0     // 1 connection
      }
    };
  
    matches.forEach(match => {
      if (!match?.job?.company) return;
  
      const connectionCount = match.connections?.length || 0;
      stats.totalConnections += connectionCount;
      stats.companies.add(match.job.company);
  
      // Track connections per company
      if (!stats.connectionsPerCompany[match.job.company]) {
        stats.connectionsPerCompany[match.job.company] = 0;
      }
      stats.connectionsPerCompany[match.job.company] += connectionCount;
  
      // Calculate connection strength
      if (connectionCount > 3) {
        stats.connectionStrength.strong++;
      } else if (connectionCount >= 2) {
        stats.connectionStrength.medium++;
      } else if (connectionCount === 1) {
        stats.connectionStrength.weak++;
      }
    });
  
    return {
      ...stats,
      companies: stats.companies.size,
      averageConnectionsPerJob: 
        stats.totalJobs > 0 ? stats.totalConnections / stats.totalJobs : 0
    };
  };
  
  /**
   * Sort matches by relevance
   */
  export const sortMatches = (matches, sortBy = 'connections') => {
    return [...matches].sort((a, b) => {
      switch (sortBy) {
        case 'connections':
          return (b.connections?.length || 0) - (a.connections?.length || 0);
        case 'company':
          return (a.job?.company || '').localeCompare(b.job?.company || '');
        case 'title':
          return (a.job?.title || '').localeCompare(b.job?.title || '');
        default:
          return 0;
      }
    });
  };
  
  /**
   * Group matches by company
   */
  export const groupMatchesByCompany = (matches) => {
    return matches.reduce((groups, match) => {
      if (!match?.job?.company) return groups;
      
      const company = match.job.company;
      if (!groups[company]) {
        groups[company] = [];
      }
      groups[company].push(match);
      return groups;
    }, {});
  };