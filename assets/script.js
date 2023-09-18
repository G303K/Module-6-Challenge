// Constants for API URL and API key
const API_KEY = 'db731e50091b17e5caf87c05cbb02ce4';
const API_URL = 'https://api.openweathermap.org/data/2.5/';

// HTML elements
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container'); // Updated
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistoryButtons = document.getElementById('saved-submissions'); // Updated for buttons

// Event listener for form submission
cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityName = cityInput.value.trim();

    if (cityName) {
        // Fetch current weather and forecast data
        getWeatherData(cityName);
        // Add city to search history as a button
        addToSearchHistory(cityName);
        // Clear input field
        cityInput.value = '';
    }
});

// Function to fetch weather data from the API
function getWeatherData(cityName) {
    // Fetch current weather data
    fetch(`${API_URL}weather?q=${cityName}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            // Update the current weather section with data
            displayCurrentWeather(data);
        })
        .catch((error) => {
            console.error('Error fetching current weather:', error);
        });

    // Fetch 5-day forecast data
    fetch(`${API_URL}forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            // Update the forecast section with data
            displayForecast(data);
        })
        .catch((error) => {
            console.error('Error fetching forecast:', error);
        });
}

// Function to display current weather data
function displayCurrentWeather(data) {
    // Update the HTML elements with current weather data including an icon
    currentWeather.innerHTML = `
        <h3>Current Weather in ${data.name}</h3>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description} <i class="fas ${getWeatherIconClass(data.weather[0].icon)}"></i></p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;

    // Update the flex container (weatherContainer) to flex relative to its content
    weatherContainer.style.display = 'flex';
}

// Function to display 5-day forecast data
function displayForecast(data) {
    // Clear the previous forecast data
    forecast.innerHTML = '';

    // Loop through the forecast data for the next 5 days
    for (let i = 0; i < 5; i++) {
        const forecastItem = data.list[i];
        const date = new Date(forecastItem.dt * 1000); // Convert timestamp to date

        // Create a div element for each forecast item
        const forecastDiv = document.createElement('div');
        forecastDiv.innerHTML = `
            <h4>Day ${i + 1}</h4>
            <p>Date: ${date.toDateString()}</p>
            <p>Temperature: ${forecastItem.main.temp}°C</p>
            <p>Weather: ${forecastItem.weather[0].description} <i class="fas ${getWeatherIconClass(forecastItem.weather[0].icon)}"></i></p>
            <p>Humidity: ${forecastItem.main.humidity}%</p>
        `;

        // Append the forecast item to the forecast section
        forecast.appendChild(forecastDiv);
    }
}

// Function to map weather icons to Font Awesome icon classes
function getWeatherIconClass(iconCode) {
    switch (iconCode) {
        case '01d': 
        case '01n': 
            return 'fa-moon';
        case '02d': 
            return 'fa-cloud-sun';
        case '02n': 
            return 'fa-cloud-moon';
        case '03d': 
        case '03n': 
            return 'fa-cloud';
        case '04d': 
        case '04n': 
            return 'fa-cloud-sun';
        case '09d': 
        case '09n': 
        case '10d': 
        case '10n': 
            return 'fa-cloud-showers-heavy';
        case '11d': 
        case '11n':
            return 'fa-bolt';
        case '13d': 
        case '13n': 
            return 'fa-snowflake';
        case '50d': 
        case '50n': 
            return 'fa-smog';
        default:
            return 'fa-question-circle'; 
    }
}

// Function to add a city to the search history as a button
function addToSearchHistory(cityName) {
    // Create a button element for the saved submission
    const button = document.createElement('button');
    button.textContent = cityName;
    
    // Add an event listener to the button to perform a new search when clicked
    button.addEventListener('click', () => {
        // Fetch weather data for the saved city
        getWeatherData(cityName);
    });
    
    // Append the button to the saved-submissions element
    searchHistoryButtons.appendChild(button);
}




