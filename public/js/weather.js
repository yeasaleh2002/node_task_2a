const updateWeather = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `/api/weather?lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      const widget = document.getElementById("weather-widget");
      const condition = data.current.condition.text.toLowerCase();

      let weatherIcon =
        "https://t4.ftcdn.net/jpg/01/25/86/35/360_F_125863509_jaISqQt7MOfhOT3UxRTHZoEbMmmFYIr8.jpg";
      if (condition.includes("rain"))
        weatherIcon =
          "https://static.vecteezy.com/system/resources/previews/042/146/565/non_2x/ai-generated-beautiful-rain-day-view-photo.jpg";
      if (condition.includes("snow"))
        weatherIcon =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzVb21zkwo4UXanGZSam7VqySOxpUVPVdDw&s";

      console.log("data", data);

      widget.innerHTML = `
      <div>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;">
            <div>
              <img src="${weatherIcon}" alt="Weather icon" style="height:180px" />
            </div>
            <span style="font-size: 2.25rem; font-weight: 800; color: #1f2937;">${data.current.temp_c}°C</span>
          </div>
        </div>
      `;
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

setInterval(updateWeather, 300000);
updateWeather();
