window.onload = () => {
  console.log("Airport JS loaded");
  const searchInput = document.getElementById("airport-search");
  const resultsList = document.getElementById("airport-results");
  const mapDiv = document.getElementById("map");
  const distanceCard = document.getElementById("distance-card");
  const distanceText = document.getElementById("distance");

  let map;

  /**
   * Fetch airports based on the search query
   * @param {string} search - Search term for airports
   * @returns {Promise<Object[]>} - List of airports
   */
  const fetchAirports = async (search) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/airports/airports?search=${search}`
      );
      if (!response.ok)
        throw new Error(`Failed to fetch airports: ${response.statusText}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching airports:", error);
      return [];
    }
  };

  /**
   * Handle the search input event
   * @param {Event} e
   */
  const handleSearchInput = async (e) => {
    const search = e.target.value.trim();
    if (search.length >= 3) {
      const airports = await fetchAirports(search);
      if (airports.length > 0) {
        displayAirports(airports);
      } else {
        resultsList.innerHTML = "<li>No results found</li>";
      }
    } else {
      resultsList.innerHTML = "";
    }
  };

  /**
   * Display the list of airports
   * @param {Object[]} airports - Array of airport objects
   */
  const displayAirports = (airports) => {
    resultsList.innerHTML = airports
      .map(
        (airport) => `
        <li>
          <button 
            class="w-full text-left p-2 border rounded hover:bg-gray-200 cursor-pointer" 
            data-lat="${airport.latitude}" 
            data-lon="${airport.longitude}">
            ${airport.name} (${airport.code})
          </button>
        </li>`
      )
      .join("");
  };

  /**
   * Calculate the distance between two coordinates using the Haversine formula
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lon1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lon2 - Longitude of point 2
   * @returns {number} - Distance in kilometers
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
   * Handle the airport selection event
   * @param {Event} e
   */
  const handleAirportSelection = (e) => {
    if (e.target.tagName === "BUTTON") {
      const lat = parseFloat(e.target.dataset.lat);
      const lon = parseFloat(e.target.dataset.lon);

      // Calculate and show distance
      const arcticCircleLat = 66.5628;
      const arcticCircleLon = 0; // Prime Meridian
      const distance = calculateDistance(
        arcticCircleLat,
        arcticCircleLon,
        lat,
        lon
      );

      // Display distance in the card
      distanceText.innerHTML = `<h1 style="text-align:center; font-size:48px; font-weight: 600;"> ${distance.toFixed(
        2
      )} KM </h1>`;
      distanceCard.classList.remove("hidden");

      // Show the map
      mapDiv.classList.remove("hidden");
      if (!map) {
        map = new ol.Map({
          target: "map",
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM(),
            }),
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: 10,
          }),
        });
      } else {
        // Update the map view
        map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
        map.getView().setZoom(10);
      }
    }
  };

  // Add event listeners
  searchInput.addEventListener("input", handleSearchInput);
  resultsList.addEventListener("click", handleAirportSelection);
};
