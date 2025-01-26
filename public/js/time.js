const updateTimes = async () => {
  const response = await fetch("/api/time");
  const times = await response.json();

  Object.entries(times).forEach(([zone, data]) => {
    const element = document.getElementById(`${zone}-time`);
    const date = new Date(data.time);
    
    // Format the time with the timezone
    const formattedTime = date.toLocaleTimeString('en-US', {
      timeZone: data.timezone,
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    });
    
    element.textContent = `${formattedTime}`;
  });
};

setInterval(updateTimes, 1000);
updateTimes();
