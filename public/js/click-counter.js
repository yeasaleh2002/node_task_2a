window.onload = function() {
    const totalAnalyticsElement = document.getElementById('total-analytics');
    
    async function updateClickCount() {
        try {
            const response = await fetch('/api/analytics/count');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            totalAnalyticsElement.textContent = data.count || '0';
        } catch (error) {
            console.error('Error fetching click count:', error);
            totalAnalyticsElement.textContent = 'Error loading count';
        }
    }

    // Update count immediately when page loads
    updateClickCount();

    // Update count every minute
    setInterval(updateClickCount, 60000);
};
