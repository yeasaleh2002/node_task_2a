// 2FA Verification
const verify2FA = async () => {
  const token = prompt('Enter your 2FA token:');
  const response = await fetch('/api/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  
  if (response.ok) {
    document.getElementById('2fa-modal').style.display = 'none';
  } else {
    alert('Invalid 2FA token');
  }
};

// Analytics tracking
const trackWidgetClick = async (widgetName) => {
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      widget_name: widgetName,
      browser_type: navigator.userAgent
    })
  });
}; 