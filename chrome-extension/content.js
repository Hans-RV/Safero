// Safero Chrome Extension - Gmail Content Script
console.log('Safero: Extension loaded on Gmail');

const API_URL = 'http://localhost:3000/api/analyze-email';

// Store analyzed emails to avoid re-analyzing
const analyzedEmails = new Set();

// Analyze email function
async function analyzeEmail(emailData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Safero: Error analyzing email', error);
    return null;
  }
}

// Extract email data from Gmail DOM
function extractEmailData(emailElement) {
  try {
    // Get sender email
    const senderElement = emailElement.querySelector('[email]');
    const senderEmail = senderElement?.getAttribute('email') || '';
    
    // Get sender name
    const senderName = senderElement?.getAttribute('name') || 
                       emailElement.querySelector('.go')?.textContent?.trim() || '';
    
    // Get subject
    const subjectElement = emailElement.querySelector('[data-subject]') || 
                          emailElement.querySelector('h2');
    const subject = subjectElement?.getAttribute('data-subject') || 
                   subjectElement?.textContent?.trim() || '';
    
    // Get email body
    const bodyElement = emailElement.querySelector('.a3s') || 
                       emailElement.querySelector('[data-message-id]');
    const body = bodyElement?.innerText || bodyElement?.textContent || '';
    
    // Extract links
    const linkElements = emailElement.querySelectorAll('a[href]');
    const links = Array.from(linkElements)
      .map(a => a.href)
      .filter(href => href.startsWith('http'))
      .slice(0, 10); // Limit to first 10 links
    
    return {
      senderName,
      senderEmail,
      subject,
      body: body.substring(0, 5000), // Limit body size
      links: links.join(', '),
    };
  } catch (error) {
    console.error('Safero: Error extracting email data', error);
    return null;
  }
}

// Create and inject security badge
function createSecurityBadge(result, emailElement) {
  // Remove existing badge if any
  const existingBadge = emailElement.querySelector('.safero-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  const badge = document.createElement('div');
  badge.className = 'safero-badge';
  
  const riskLevel = result.analysis?.riskLevel || 'unknown';
  const score = result.analysis?.overallScore || 0;
  
  let badgeClass = 'safero-safe';
  let badgeText = '✓ Safe';
  let badgeColor = '#10b981';
  
  if (riskLevel === 'high' || score < 30) {
    badgeClass = 'safero-danger';
    badgeText = '⚠ Dangerous';
    badgeColor = '#ef4444';
  } else if (riskLevel === 'medium' || score < 70) {
    badgeClass = 'safero-suspicious';
    badgeText = '⚠ Suspicious';
    badgeColor = '#f59e0b';
  }
  
  badge.className = `safero-badge ${badgeClass}`;
  badge.innerHTML = `
    <div class="safero-badge-content">
      <span class="safero-badge-icon">🛡️</span>
      <span class="safero-badge-text">${badgeText}</span>
      <span class="safero-badge-score">${score}%</span>
    </div>
  `;
  
  // Add click to show details
  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    showDetailedAnalysis(result, emailElement);
  });
  
  // Insert badge at the top of email
  const headerElement = emailElement.querySelector('.gE') || 
                       emailElement.querySelector('.gs') ||
                       emailElement.querySelector('tr');
  
  if (headerElement) {
    headerElement.style.position = 'relative';
    headerElement.insertBefore(badge, headerElement.firstChild);
  }
}

// Show detailed analysis
function showDetailedAnalysis(result, emailElement) {
  const existingDetails = emailElement.querySelector('.safero-details');
  if (existingDetails) {
    existingDetails.remove();
    return;
  }

  const details = document.createElement('div');
  details.className = 'safero-details';
  
  const analysis = result.analysis || {};
  const threats = analysis.threats || [];
  
  details.innerHTML = `
    <div class="safero-details-header">
      <h3>🛡️ Safero Security Analysis</h3>
      <button class="safero-close">×</button>
    </div>
    <div class="safero-details-body">
      <div class="safero-metric">
        <span class="safero-metric-label">Overall Score:</span>
        <span class="safero-metric-value">${analysis.overallScore || 0}%</span>
      </div>
      <div class="safero-metric">
        <span class="safero-metric-label">Risk Level:</span>
        <span class="safero-metric-value safero-risk-${analysis.riskLevel}">${analysis.riskLevel || 'Unknown'}</span>
      </div>
      ${threats.length > 0 ? `
        <div class="safero-threats">
          <h4>⚠️ Detected Threats:</h4>
          <ul>
            ${threats.map(threat => `<li>${threat}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${analysis.recommendation ? `
        <div class="safero-recommendation">
          <h4>💡 Recommendation:</h4>
          <p>${analysis.recommendation}</p>
        </div>
      ` : ''}
    </div>
  `;
  
  const closeBtn = details.querySelector('.safero-close');
  closeBtn.addEventListener('click', () => details.remove());
  
  const bodyElement = emailElement.querySelector('.a3s')?.parentElement || emailElement;
  bodyElement.insertBefore(details, bodyElement.firstChild);
}

// Process email
async function processEmail(emailElement) {
  const emailId = emailElement.getAttribute('data-message-id') || 
                 emailElement.id || 
                 Math.random().toString();
  
  if (analyzedEmails.has(emailId)) {
    return; // Already analyzed
  }
  
  analyzedEmails.add(emailId);
  
  const emailData = extractEmailData(emailElement);
  if (!emailData || !emailData.senderEmail) {
    return;
  }
  
  console.log('Safero: Analyzing email from', emailData.senderEmail);
  
  // Show loading indicator
  const loadingBadge = document.createElement('div');
  loadingBadge.className = 'safero-badge safero-loading';
  loadingBadge.innerHTML = `
    <div class="safero-badge-content">
      <span class="safero-spinner"></span>
      <span class="safero-badge-text">Analyzing...</span>
    </div>
  `;
  
  const headerElement = emailElement.querySelector('.gE') || 
                       emailElement.querySelector('.gs') ||
                       emailElement.querySelector('tr');
  
  if (headerElement) {
    headerElement.style.position = 'relative';
    headerElement.insertBefore(loadingBadge, headerElement.firstChild);
  }
  
  // Analyze email
  const result = await analyzeEmail(emailData);
  
  // Remove loading badge
  loadingBadge.remove();
  
  if (result) {
    createSecurityBadge(result, emailElement);
  }
}

// Observe Gmail for new emails
function observeGmail() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) { // Element node
          // Check if it's an email element
          if (node.matches('[data-message-id]') || 
              node.querySelector('[data-message-id]') ||
              node.matches('.gs') ||
              node.matches('.adn')) {
            
            const emailElement = node.matches('[data-message-id]') ? node : 
                               node.querySelector('[data-message-id]');
            
            if (emailElement) {
              setTimeout(() => processEmail(emailElement), 500);
            }
          }
        }
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
  // Also scan existing emails on page load
  setTimeout(() => {
    const existingEmails = document.querySelectorAll('[data-message-id]');
    existingEmails.forEach(email => processEmail(email));
  }, 2000);
}

// Initialize when Gmail is ready
function initialize() {
  if (window.location.hostname === 'mail.google.com') {
    console.log('Safero: Initializing on Gmail');
    observeGmail();
  }
}

// Wait for Gmail to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
