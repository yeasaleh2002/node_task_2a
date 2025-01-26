// distance.js

async function calculateDistance() {
    const airport = document.getElementById("airport-dropdown").value;
    const response = await fetch(`/distance?airport=${airport}`);
    const data = await response.json();
    document.getElementById("distance-result").innerHTML = `Distance from Arctic Circle: ${data.distance} km`;
  }
  