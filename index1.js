window.addEventListener("load", function () {
  const weatherCardList = document.querySelector(".weather-cards-container");
  const toggleThemeBtn = document.querySelector(".theme-toggle");
  const sidePanel = document.querySelector(".side-panel");
  const settingsBtn = document.querySelector("#menu-icon");
  const closeSettingsPannelBtn = document.querySelector(
    "#close-side-panel-btn"
  );
  const locations = ["London", "New York", "Tokyo"];
  // displayWeatherCards(locations);

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

  toggleThemeBtn.addEventListener("click", toggleTheme);

  function toggleTheme() {
    console.log("Toggling Theme");
    if (toggleThemeBtn.src.includes("light_mode")) {
      toggleThemeBtn.src =
        "assets/icons/menu-icons/dark_mode_24dp_FILL0_wght400_GRAD0_opsz24.svg";
    } else {
      toggleThemeBtn.src =
        "assets/icons/menu-icons/light_mode_24dp_FILL0_wght400_GRAD0_opsz24.svg";
    }
  }

  settingsBtn.addEventListener("click", () => {
    console.log("Menu button was clicked!");
    toggleSidePanel();
  });

  closeSettingsPannelBtn.addEventListener("click", toggleSidePanel);

  function toggleSidePanel() {
    console.log("Toggling side panel...");
    sidePanel.classList.toggle("open");
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
    let viewDataBtn = document.createElement("button");
    let viewBtnTitle = document.createElement("h4");
    let viewBtnSymbol = document.createElement("img");

    weatherCard.className = "weather-card";
    locationLabel.className = "location-label";
    locationName.className = "location-name";
    weatherDetailsContainer.className = "weather-details-container";
    temperatureLabel.className = "temperature-label";
    weatherDetails.className = "weather-details";
    weatherDescription.className = "weather-description";
    viewDataBtn.className = "view-data";

    viewBtnSymbol.src =
      "assets/icons/menu-icons/arrow_forward_ios_24dp_FILL0_wght400_GRAD0_opsz24.svg";
    viewBtnTitle.textContent = "View";
    temperatureLabel.textContent = `${temperature}°`;
    locationLabel.textContent = location;

    viewDataBtn.appendChild(viewBtnTitle);
    viewDataBtn.appendChild(viewBtnSymbol);

    locationLabel.appendChild(locationName);
    weatherDetails.appendChild(weatherDescription);

    weatherDetailsContainer.appendChild(temperatureLabel);
    weatherDetailsContainer.appendChild(weatherDetails);

    weatherCard.appendChild(locationLabel);
    weatherCard.appendChild(weatherDetailsContainer);
    weatherCard.appendChild(viewDataBtn);

    return weatherCard;
  }
});
