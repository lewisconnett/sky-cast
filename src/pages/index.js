window.addEventListener('load', function () {
  // Constants
  const API_KEY = 'x0oWKsp7CFXZutB7BtLJKcLQ7fSbmmJ2';
  const WEATHER_API_URL = `https://api.tomorrow.io/v4/weather/realtime?apikey=${API_KEY}&location=`;

  // DOM Elements
  const weatherCardList = document.querySelector('.weather-cards-container');
  const toggleThemeBtn = document.querySelector('.theme-toggle');
  const sidePanel = document.querySelector('.side-panel');
  const settingsBtn = document.querySelector('#menu-icon');
  const mainSectionTitle = document.querySelector('#section-title');
  const closeSettingsPannelBtn = document.querySelector('#close-side-panel-btn');
  const changeTempUnitBtn = document.querySelector('#change-temp-unit-btn');
  const changeTemperatureLabel = document.querySelector('#change-temperature-unit');

  // Initial Data
  const locations = ['London', 'New York', 'Tokyo', 'Madrid'];
  let temperatureUnit = ['Celsius', '°C'];

  // Set the date in the main section title
  const today = new Date();
  const options = { month: 'short', day: 'numeric' };
  mainSectionTitle.innerHTML = `Today, <span class="date">${today.toLocaleDateString('en-GB', options)}</span>`;

  // Initialise the temperature label
  changeTemperatureLabel.textContent = `Change the unit to Fahrenheit (°F)`;

  // Fetch weather data for the given locations
  async function fetchWeatherData(location) {
    try {
      const response = await fetch(`${WEATHER_API_URL}${location}`, {
        method: 'GET',
        headers: { accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
      throw error;
    }
  }

  // Display weather cards for the given location
  async function displayWeatherCards(locations, temperatureUnit) {
    while (weatherCardList.firstChild) {
      weatherCardList.removeChild(weatherCardList.firstChild);
    }

    for (const location of locations) {
      try {
        const weatherData = await fetchWeatherData(location);
        const temperature = Math.round(weatherData.data.values.temperature);
        const weatherCard = createWeatherCard(location, temperature, temperatureUnit);
        weatherCardList.appendChild(weatherCard);
      } catch (error) {
        console.error(`Failed to display weather for ${location}: ${error}`);
      }
    }
  }

  // Toggle the theme between light and dark mode
  function toggleTheme() {
    const isLightMode = toggleThemeBtn.src.includes('light_mode');
    toggleThemeBtn.src = isLightMode
      ? '../assets/icons/menu-icons/dark_mode_24dp_FILL0_wght400_GRAD0_opsz24.svg'
      : '../assets/icons/menu-icons/light_mode_24dp_FILL0_wght400_GRAD0_opsz24.svg';
  }

  toggleThemeBtn.addEventListener('click', toggleTheme);

  // Toggle the side panel visibility
  function toggleSidePanel() {
    sidePanel.classList.toggle('open');
  }

  // Change the temperature unit
  function changeTemperatureUnit() {
    temperatureUnit =
      temperatureUnit[0] === 'Celsius'
        ? ['Fahrenheit', '°F']
        : ['Celsius', '°C'];
    changeTemperatureLabel.textContent = `Change the unit to ${temperatureUnit[0]} (${temperatureUnit[1]})`;
    console.log(`Temperature unit is ${temperatureUnit}`);
    displayWeatherCards(locations, temperatureUnit);
  }

  // Create a weather card element
  function createWeatherCard(location, temperature, temperatureUnit) {
    const weatherCard = document.createElement('div');
    weatherCard.className = 'weather-card';

    const locationLabel = document.createElement('div');
    locationLabel.className = 'location-label';
    locationLabel.textContent = location;

    const temperatureLabel = document.createElement('h3');
    temperatureLabel.className = 'temperature-label';
    temperatureLabel.textContent = `${temperature}${temperatureUnit[1]}`;

    const weatherDetailsContainer = document.createElement('div');
    weatherDetailsContainer.className = 'weather-details-container';
    weatherDetailsContainer.appendChild(temperatureLabel);

    const viewDataBtn = document.createElement('button');
    viewDataBtn.className = 'view-data';
    viewDataBtn.innerHTML = `<h4>View</h4><img src="../assets/icons/menu-icons/arrow_forward_ios_24dp_FILL0_wght400_GRAD0_opsz24.svg" alt="View">`;

    weatherCard.appendChild(locationLabel);
    weatherCard.appendChild(weatherDetailsContainer);
    weatherCard.appendChild(viewDataBtn);

    return weatherCard;
  }

  // Adds a new location to user's list of locations
  function addWeatherLocation(locations, newLocation) {
    return locations.push(newLocation);
  }

  // Removes a location from user's list of locations
  function removeWeatherLocation(locations, locationToDelete) {
    let updatedLocationList = [];
    locations.forEach((location) => {
      if (location != locationToDelete) {
        updatedLocationList.push(location);
      }
    });
    return updatedLocationList;
  }

  // Event Listeners
  toggleThemeBtn.addEventListener('click', toggleTheme);
  settingsBtn.addEventListener('click', toggleSidePanel);
  closeSettingsPannelBtn.addEventListener('click', toggleSidePanel);
  changeTempUnitBtn.addEventListener('click', changeTemperatureUnit);

  // Initial call to display weather cards
  displayWeatherCards(locations, temperatureUnit);
});
