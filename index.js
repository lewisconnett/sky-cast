window.addEventListener("load", function () {
    var city = document.querySelector("#search-input");
    var searchCityBtn = document.querySelector("#search-button");
    const now = new Date();
    const hours = now.getHours();
    displayWelcomeMessage(hours);
    var location;

    var defaultLocation = "london";
    console.log(defaultLocation);
    search(defaultLocation);

    const formattedDate = getFormattedDate();
    updateDate(formattedDate);


    city.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            location = city.value;
            console.log("User pressed enter, location: " + location);
            search(location);
        }
    });

    searchCityBtn.addEventListener("click", function () {
        location = city.value;
        console.log("User clicked search, location: " + location);
        search(location);
    });

    async function search(location) {
        const options = {
            method: "GET",
            headers: { accept: "application/json" },
        };

        fetch(
            `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=x0oWKsp7CFXZutB7BtLJKcLQ7fSbmmJ2`,
            options
        )
            .then((response) => response.json())
            .then((data) => {
                const weatherData = data.data.values;
                const fullLocationName = data.location.name;
                updateLocationLabel(fullLocationName);
                displayContent(weatherData, location);
                displayWeatherIcon(weatherData);
            })
            .catch((err) => console.error(err));
    }

    function displayContent(weatherData, location) {
        const temperature = weatherData.temperature;
        const temperatureLabel = document.querySelector("#temperature");
        temperatureLabel.textContent = `${temperature}°C`;

        const windSpeed = weatherData.windSpeed;
        const windSpeedLabel = document.querySelector("#wind-speed");
        windSpeedLabel.textContent = `${windSpeed} km/h`;

        const humidity = weatherData.humidity;
        const humidityLabel = document.querySelector("#humidity");
        humidityLabel.textContent = `${humidity}%`;

        const precipitationProbability = weatherData.precipitationProbability;
        const precipitationProbabilityLabel = document.querySelector(
            "#precipitation-probability"
        );
        precipitationProbabilityLabel.textContent = `${precipitationProbability}%`;
    }

    function updateLocationLabel(fullLocationName) {
        const locationNameLabel = document.querySelector("#location-name");
        locationNameLabel.textContent = fullLocationName.split(",")[0];
    }

    function displayWelcomeMessage(timeOfDay) {
        var welcomeMessageLabel = document.querySelector("#welcome-message");
        welcomeMessageLabel.textContent =
            timeOfDay < 12
                ? "Good Morning!"
                : timeOfDay < 18
                ? "Good Afternoon!"
                : "Good Evening!";
    }

    function displayWeatherIcon(weatherData) {
        const weatherCode = weatherData.weatherCode;
        const weatherIcon = document.querySelector("#weather-icon");
        const weatherIconName = weatherDescriptions[weatherCode];
        weatherIcon.src = `assets/weather-icons/${weatherIconName}.svg`;
        weatherIcon.style.display = "block";
    }

    const weatherDescriptions = {
        1000: "clear_day",
        1001: "cloudy",
        1100: "mostly_clear_day",
        1101: "partly_cloudy_day",
        1102: "mostly_cloudy",
        2000: "fog",
        2100: "fog_light",
        4000: "drizzle",
        4001: "rain",
        4200: "rain_light",
        4201: "rain_heavy",
        5000: "snow",
        5001: "flurries",
        5100: "snow_light",
        5101: "snow_heavy",
        6000: "freezing_drizzle",
        6001: "freezing_rain",
        6201: "freezing_rain_heavy",
        7000: "ice_pellets",
        7101: "ice_pellets_heavy",
        7102: "ice_pellets_light",
        8000: "tstorm",
    };

    function updateDate(formattedDate) {
        var date = document.querySelector("#date")
        date.textContent = `Today, ${formattedDate}`;
    }

    function getFormattedDate() {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = today.toLocaleString("default", { month: "short" });
        return `${day} ${month}`;
    }
});
