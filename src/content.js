// LinkedIn page selectors
const SELECTORS = {
  CONNECTIONS_TABLE: '.mn-connections-summary__entity-info',
  CONNECTION_NAME: '.mn-connection-card__name',
  CONNECTION_OCCUPATION: '.mn-connection-card__occupation',
  CONNECTION_COMPANY: '.mn-connection-card__company',
};

// Function to extract connection data from the page
function extractConnectionData() {
  const connections = [];
  const connectionNodes = document.querySelectorAll(SELECTORS.CONNECTIONS_TABLE);

  connectionNodes.forEach((node) => {
    const nameElement = node.querySelector(SELECTORS.CONNECTION_NAME);
    const occupationElement = node.querySelector(SELECTORS.CONNECTION_OCCUPATION);
    const companyElement = node.querySelector(SELECTORS.CONNECTION_COMPANY);

    if (nameElement) {
      connections.push({
        name: nameElement.textContent.trim(),
        title: occupationElement ? occupationElement.textContent.trim() : '',
        company: companyElement ? companyElement.textContent.trim() : '',
      });
    }
  });

  return connections;
}

// Function to scroll the page to load more connections
async function scrollToLoadMore() {
  return new Promise((resolve) => {
    let totalHeight = 0;
    const distance = 100;
    const timer = setInterval(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;

      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractConnections') {
    (async () => {
      try {
        // Scroll to load all connections
        await scrollToLoadMore();
        
        // Extract connection data
        const connections = extractConnectionData();
        
        // Send the data back
        sendResponse({ success: true, connections });
      } catch (error) {
        console.error('Error extracting connections:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});