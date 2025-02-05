function trackWidgetClick(widgetName) {
    const data = {
        widget_name: widgetName,
        browser_type: navigator.userAgent
    };

    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.status === 429) {
            const error = await response.json();
            window.location.href = '/upgrade-analytics.html';
            return;
        }
        if (!response.ok) {
            throw new Error('Analytics request failed');
        }
    })
    .catch(error => console.error('Error logging analytics:', error));
}

// Add click event listeners to all widgets
document.addEventListener('DOMContentLoaded', function() {
    // Weather Widget
    document.getElementById('weather-widget')?.addEventListener('click', () => trackWidgetClick('weather'));

    // Time Widgets
    document.getElementById('london-time')?.addEventListener('click', () => trackWidgetClick('london-time'));
    document.getElementById('est-time')?.addEventListener('click', () => trackWidgetClick('est-time'));
    document.getElementById('nigeria-time')?.addEventListener('click', () => trackWidgetClick('nigeria-time'));
    document.getElementById('pakistan-time')?.addEventListener('click', () => trackWidgetClick('pakistan-time'));

    // Airport Search Widget
    document.getElementById('airport-search')?.addEventListener('click', () => trackWidgetClick('airport-search'));

    // Map Widget
    document.getElementById('map')?.addEventListener('click', () => trackWidgetClick('map'));

    // Distance Calculator Widget
    document.getElementById('distance-calculator')?.addEventListener('click', () => trackWidgetClick('distance-calculator'));

    // Reddit Widget
    document.getElementById('reddit-widget')?.addEventListener('click', () => trackWidgetClick('reddit'));

    // Coin Calculator Widget
    document.getElementById('calculate-coins-btn')?.addEventListener('click', () => trackWidgetClick('coin-calculator'));

    // Upload Widget
    document.getElementById('save-btn')?.addEventListener('click', () => trackWidgetClick('upload'));

    // Export/Import Widgets
    document.getElementById('export-btn')?.addEventListener('click', () => trackWidgetClick('export'));
    document.getElementById('import-btn')?.addEventListener('click', () => trackWidgetClick('import'));
    document.getElementById('posts')?.addEventListener('click', () => trackWidgetClick('reddit'));
});
