// Your API key for accessing weather data
var apiKey = "1b18ce13c84e21faafb19c931bb29331";

// An array to store saved search history
var savedSearches = [];

// Function to add a city to the search history list
var searchHistoryList = (cityName) => {
  // Remove any existing entry with the same city name
  $('.past-search:contains("' + cityName + '")').remove();

  // Create a new entry element
  var searchHistoryEntry = $("<p>").addClass("past-search").text(cityName);
  var searchEntryContainer = $("<div>")
    .addClass("past-search-container")
    .append(searchHistoryEntry);

  // Append the new entry to the search history container
  $("#search-history-container").append(searchEntryContainer);

  // Load the saved searches from local storage and add the new search
  if (savedSearches.length > 0) {
    savedSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];
  }
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

  // Clear the search input field
  $("#search-input").val("");
};

// Function to load and display the search history from local storage
var loadSearchHistory = () => {
  var savedSearchHistory = localStorage.getItem("savedSearches");
  if (savedSearchHistory) {
    savedSearchHistory = JSON.parse(savedSearchHistory);
    for (var i = 0; i < savedSearchHistory.length; i++) {
      searchHistoryList(savedSearchHistory[i]);
    }
  }
};

// Function to display current weather conditions for a city
var currentWeatherSection = (cityName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((response) => {
      // Extract latitude and longitude for the city
      var cityLon = response.coord.lon;
      var cityLat = response.coord.lat;

      // Fetch one-call weather data for the city
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((response) => {
          // Add the city to the search history
          searchHistoryList(cityName);

          // Select and update DOM elements with weather data
          var currentWeatherContainer = $(
            "#current-weather-container"
          ).addClass("current-weather-container");
          var currentTitle = $("#current-title");
          var currentDay = moment().format("M/D/YYYY");
          currentTitle.text(`${cityName} (${currentDay})`);
          var currentIcon = $("#current-weather-icon").addClass(
            "current-weather-icon"
          );
          var currentIconCode = response.current.weather[0].icon;
          currentIcon.attr(
            "src",
            `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`
          );
          var currentTemperature = $("#current-temperature").text(
            "Temperature: " + response.current.temp + " \u00B0F"
          );
          var currentHumidity = $("#current-humidity").text(
            "Humidity: " + response.current.humidity + "%"
          );
          var currentWindSpeed = $("#current-wind-speed").text(
            "Wind Speed: " + response.current.wind_speed + " MPH"
          );
          var currentUvIndex = $("#current-uv-index").text("UV Index: ");
          var currentNumber = $("#current-number").text(response.current.uvi);

          // Clear previous UV index class
          currentNumber.removeClass("favorable moderate severe");

          // Set UV index class based on severity
          if (response.current.uvi <= 2) {
            currentNumber.addClass("favorable");
          } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
            currentNumber.addClass("moderate");
          } else {
            currentNumber.addClass("severe");
          }
        });
    })
    .catch((err) => {
      // Handle errors, e.g., city not found
      $("#search-input").val("");
      alert(
        "We could not find the city you searched for. Try searching for a valid city."
      );
    });
};

// Function to display the 5-day weather forecast for a city
var fiveDayForecastSection = (cityName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((response) => {
      // Extract latitude and longitude for the city
      var cityLon = response.coord.lon;
      var cityLat = response.coord.lat;

      // Fetch one-call weather data for the city
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((response) => {
          // Set the title for the 5-day forecast
          var futureForecastTitle = $("#future-forecast-title").text(
            "5-Day Forecast:"
          );

          // Loop through the next 5 days and update forecast data
          for (var i = 1; i <= 5; i++) {
            var futureDate = $("#future-date-" + i).text(
              moment().add(i, "d").format("M/D/YYYY")
            );
            var futureIcon = $("#future-icon-" + i).addClass("future-icon");
            var futureIconCode = response.daily[i].weather[0].icon;
            futureIcon.attr(
              "src",
              `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`
            );
            var futureTemp = $("#future-temp-" + i).text(
              "Temp: " + response.daily[i].temp.day + " \u00B0F"
            );
            var futureHumidity = $("#future-humidity-" + i).text(
              "Humidity: " + response.daily[i].humidity + "%"
            );
          }
        });
    });
};

// Event handler for the search form submission
$("#search-form").on("submit", (event) => {
  event.preventDefault();
  var cityName = $("#search-input").val();
  if (cityName === "" || cityName == null) {
    alert("Please enter the name of a city.");
  } else {
    currentWeatherSection(cityName);
    fiveDayForecastSection(cityName);
  }
});

// Event handler for clicking on a previous search history entry
$("#search-history-container").on("click", "p", function () {
  var previousCityName = $(this).text();
  currentWeatherSection(previousCityName);
  fiveDayForecastSection(previousCityName);
  $(this).remove();
});

// Load and display the search history when the page loads
loadSearchHistory();
