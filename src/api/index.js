// API endpoints configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// Common fetch configuration
const createFetchConfig = (method = 'GET', body = null) => {
  const config = {
    method,
    headers: {
      'Accept': 'application/json',
    }
  };

  // Only add Content-Type for non-FormData bodies
  if (body && !(body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Add body if provided
  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  return config;
};

// Jobs API
export const jobsApi = {
  syncJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/api/jobs/sync`, 
      createFetchConfig('POST')
    );
    return handleResponse(response);
  },

  searchJobs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.q) queryParams.set('q', filters.q);
    if (filters.location && filters.location !== 'all') {
      queryParams.set('location', filters.location);
    }
    
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
      createFetchConfig('GET')
    );
    return handleResponse(response);
  },

  getJobsByCompany: async (company) => {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/company/${encodeURIComponent(company)}`,
      createFetchConfig('GET')
    );
    return handleResponse(response);
  }
};

// LinkedIn API
export const linkedinApi = {
  uploadConnections: async (file) => {
    // const formData = new FormData();
    // formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/api/linkedin/sync`,
      createFetchConfig('POST', file)
    );
    return handleResponse(response);
  },

  getConnections: async (sessionId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/linkedin/connections/${sessionId}`,
      createFetchConfig('GET')
    );
    return handleResponse(response);
  },
};

// Matching API
export const matchingApi = {
  getMatches: async (sessionId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/matching/${sessionId}`,
      createFetchConfig('GET')
    );
    return handleResponse(response);
  }
};

// Storage utilities for Chrome extension
export const storageApi = {
  getSessionId: async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get('sessionId');
        return result.sessionId;
      }
      return localStorage.getItem('sessionId');
    } catch (error) {
      console.error('Error accessing storage:', error);
      return null;
    }
  },

  setSessionId: async (sessionId) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ sessionId });
      } else {
        localStorage.setItem('sessionId', sessionId);
      }
    } catch (error) {
      console.error('Error setting storage:', error);
      throw error;
    }
  },

  clearSession: async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove('sessionId');
      } else {
        localStorage.removeItem('sessionId');
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};