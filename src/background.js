// Path: /src/background.js
chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: 'index.html',
    });
    await chrome.sidePanel.setPanelBehavior({
      openPanelOnActionClick: true
    });
  } catch (error) {
    console.error('Error configuring the side panel:', error);
  }
});
