window.addEventListener('load', function() {
  // Variable declarations
  const searchInput = document.querySelector('#search-input');
  const searchButton = document.querySelector('#search-button');
  const themeToggle = document.querySelector('.theme-toggle-container');
  const themeToggleButton = document.querySelector('.theme-toggle-icon');
  const sidePanel = document.querySelector('#side-panel');
  const locationContainer = document.querySelector('.location-container');
  const htmlElement = document.documentElement;
  const searchForm = document.querySelector('.search-container');
  const loader = document.querySelector('.loader');
  const now = new Date();
  const weatherDescriptions = {
    1000: 'clear_day',
    1001: 'cloudy',
    1100: 'mostly_clear_day',
    1101: 'partly_cloudy_day',
    1102: 'mostly_cloudy',
    2000: 'fog',
    2100: 'fog_light',
    4000: 'drizzle',
    4001: 'rain',
    4200: 'rain_light',
    4201: 'rain_heavy',
    5000: 'snow',
    5001: 'flurries',
    5100: 'snow_light',
    5101: 'snow_heavy',
    6000: 'freezing_drizzle',
    6001: 'freezing_rain',
    6201: 'freezing_rain_heavy',
    7000: 'ice_pellets',
    7101: 'ice_pellets_heavy',
    7102: 'ice_pellets_light',
    8000: 'tstorm',
  };
  const API_KEY = 'x0oWKsp7CFXZutB7BtLJKcLQ7fSbmmJ2';
  let userEnteredLocation;

  const successCallBack = (position) => {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;
    displayInitialWeather({userLatitude, userLongitude});
  };

  const errorCallBack = (position) => {
    console.log(position);
  };

  navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);

  // Initital setup
  displayWelcomeMessage(now.getHours());
  displayDate(getFormattedDate());

  // Event listeners for user interactions
  searchForm.addEventListener('keydown', function(e) {
    if (e.target == searchInput && e.key == 'Enter') {
      userEnteredLocation = searchInput.value;
      clearSearchInput();
      search(userEnteredLocation);
    }
  });

  searchForm.addEventListener('click', function(e) {
    if (e.target == searchButton) {
      userEnteredLocation = searchInput.value;
      clearSearchInput();
      search(userEnteredLocation);
    }
  });

  locationContainer.addEventListener('click', toggleSidePanel);

  themeToggle.addEventListener('click', function(e) {
    console.log('User clicked theme toggle');
    if (e.target == themeToggleButton) {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        themeToggleButton.src = 'assets/icons/dark-mode-switch.svg';
      } else {
        themeToggleButton.src = 'assets/icons/light-mode-switch.svg';
      }
      htmlElement.setAttribute('data-theme', newTheme);
    }
  });

  /**
   * Fetch weather data from the API.
   * @param {string} location - The location for which to fetch weather data.
   * @return {Promise<Object>} - The weather data object.
   */
  async function fetchWeatherData(location) {
    const options = {
      method: 'GET',
      headers: {accept: 'application/json'},
    };

    try {
      const response = await fetch(
          `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${API_KEY}`,
          options,
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

  /**
   * Perform a search for weather data based on the given location.
   * @param {string} location - The location for which to search weather data.
   * @return {Promise<void>}
   */
  async function search(location) {
    toggleLoader();
    try {
      const weatherData = await fetchWeatherData(location);
      const fullLocationName = weatherData.location.name;
      updateLocationLabel(fullLocationName);
      displayContent(weatherData.data.values);
      displayWeatherIcon(weatherData.data.values);
    } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
    } finally {
      toggleSidePanel();
      toggleLoader();
    }
  }


  /**
 * Display the weather content on the UI.
 * @param {Object} weatherData - The weather data object.
 */
  function displayContent(weatherData) {
    const {
      temperature,
      windSpeed,
      humidity,
      precipitationProbability,
    } = weatherData;

    const temperatureLabel = document.querySelector('#temperature');
    temperatureLabel.textContent = `${temperature}°C`;

    const windSpeedLabel = document.querySelector('#wind-speed');
    windSpeedLabel.textContent = `${windSpeed} km/h`;

    const humidityLabel = document.querySelector('#humidity');
    humidityLabel.textContent = `${humidity}%`;

    const precipitationProbabilityLabel = document.querySelector(
        '#precipitation-probability',
    );
    precipitationProbabilityLabel.textContent = `${precipitationProbability}%`;
  }

  /**
 * Update the location label on the UI.
 * @param {string} fullLocationName - The full location name.
 */
  function updateLocationLabel(fullLocationName) {
    const locationNameLabel = document.querySelector('#location-name');
    if (fullLocationName) {
      locationNameLabel.textContent = fullLocationName.split(',')[0];
    } else {
      locationNameLabel.textContent = 'My Location';
    }
  }

  /**
   * Display the weather icon on the UI.
   * @param {Object} weatherData - The weather data object.
   */
  function displayWeatherIcon(weatherData) {
    const weatherCode = weatherData.weatherCode;
    const weatherIcon = document.querySelector('#weather-icon');
    const weatherIconName = weatherDescriptions[weatherCode];
    weatherIcon.alt = weatherIconName;
    weatherIcon.src = `assets/weather-icons/${weatherIconName}.svg`;
    weatherIcon.style.display = 'block';
  }

  /**
   * Display the initial weather based on the user's location.
   * @param {Object} initialLocation - The initial location object.
   */
  function displayInitialWeather(initialLocation) {
    // eslint-disable-next-line max-len
    const userLocation = initialLocation.userLatitude + ', ' + initialLocation.userLongitude;
    search(userLocation)
        .then(() => toggleSidePanel())
        .catch((error) =>
          console.error('Error fetching weather data:', error),
        );
  }


  /**
   * Display the welcome message on the UI based on the time of day.
   * @param {number} timeOfDay - The time of day in hours (0-23).
   */
  function displayWelcomeMessage(timeOfDay) {
    const welcomeMessageLabel = document.querySelector('#welcome-message');
    welcomeMessageLabel.textContent =
            timeOfDay < 12 ?
                'Good Morning!' :
                timeOfDay < 18 ?
                'Good Afternoon!' :
                'Good Evening!';
  }


  /**
   * Display the date on the UI.
   * @param {string} formattedDate - The formatted date.
   */
  function displayDate(formattedDate) {
    const date = document.querySelector('#date');
    date.textContent = `Today, ${formattedDate}`;
  }


  /**
   * Toggle the side panel on the UI.
   */
  function toggleSidePanel() {
    sidePanel.classList.toggle('open');
  }

  /**
   * Toggle the loader on the UI
   */
  function toggleLoader() {
    loader.classList.toggle('show');
  }


  /**
   * Clear the search input value.
   */
  function clearSearchInput() {
    searchInput.value = '';
  }


  /**
   * Get the formatted date.
   * @return {string} The formatted date.
   */
  function getFormattedDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleString('default', {month: 'short'});
    return `${day} ${month}`;
  }
});
