// Safero Background Service Worker

console.log('Safero: Background service worker started');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Safero: Extension installed');
    // Open welcome page or instructions
    chrome.tabs.create({
      url: 'http://localhost:3000'
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeEmail') {
    // Handle email analysis if needed
    console.log('Safero: Received email analysis request', request.data);
  }
  return true;
});
