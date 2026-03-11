// Safero Popup Script

document.getElementById('dashboard').addEventListener('click', () => {
  chrome.tabs.create({
    url: 'http://localhost:3000/dashboard'
  });
});

// Load stats from storage
chrome.storage.local.get(['emailsScanned', 'threatsBlocked'], (result) => {
  document.getElementById('scanned').textContent = result.emailsScanned || 0;
  document.getElementById('threats').textContent = result.threatsBlocked || 0;
});
