window.addEventListener("load", function () {
  const weatherCardList = document.querySelector(".weather-cards-container");
  const locations = ["London", "New York", "Tokyo"];
//   displayWeatherCards(locations);

  // Function to fetch weather data for the given location.
  async function fetchWeatherData(location) {
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    try {
      const response = await fetch(
        `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=x0oWKsp7CFXZutB7BtLJKcLQ7fSbmmJ2`,
        options
      );
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
      throw error;
    }
  }

  // Function to display weather cards for the given locations.
  async function displayWeatherCards(locations) {
    for (i = 0; i <= locations.length - 1; i++) {
      const weatherData = await fetchWeatherData(locations[i]);
      let weatherCard = createWeatherCard(
        locations[i],
        Math.round(weatherData.data.values.temperature)
      );
      weatherCardList.appendChild(weatherCard);
    }
  }

  // Function to create a weather card.
  function createWeatherCard(location, temperature) {
    let weatherCard = document.createElement("div");
    let locationLabel = document.createElement("div");
    let locationName = document.createElement("h2");
    let weatherDetailsContainer = document.createElement("div");
    let temperatureLabel = document.createElement("h3");
    let weatherDetails = document.createElement("div");
    let weatherDescription = document.createElement("h3");
    let viewData = document.createElement("button");

    weatherCard.className = "weather-card";
    locationLabel.className = "location-label";
    locationName.className = "location-name";
    weatherDetailsContainer.className = "weather-details-container";
    temperatureLabel.className = "temperature-label";
    weatherDetails.className = "weather-details";
    weatherDescription.className = "weather-description";
    viewData.className = "view-data";

    temperatureLabel.textContent = `${temperature}°`;
    locationLabel.textContent = location;

    locationLabel.appendChild(locationName);
    weatherDetails.appendChild(weatherDescription);

    weatherDetailsContainer.appendChild(temperatureLabel);
    weatherDetailsContainer.appendChild(weatherDetails);

    weatherCard.appendChild(locationLabel);
    weatherCard.appendChild(weatherDetailsContainer);

    return weatherCard;
  }
});
