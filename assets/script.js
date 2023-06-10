//  api key
const APIKey = "553423b9a7c722184334c598bb74ab66";
// variables
const cityForm = $("#city-form");
const citySearchInput = $("#city-search");
const currentWeatherContainer = $("#current-weather");
const fiveDayContainer = $("#five-day");
const searchHistoryContainer = $("#search-history");

// search bar , both buttons 
cityForm.submit(function (event) {
  event.preventDefault();
  const cityName = citySearchInput.val().trim();
  if (cityName) {
    getApi(cityName);
    citySearchInput.val("");
  }
});
searchHistoryContainer.on("click", ".history-btn", function () {
  const cityName = $(this).data("search");
  getApi(cityName);
});

$(document).on("click", "#clear-history-button", function () {
  localStorage.removeItem("searchHistory");
  renderSearchHistory();
});

// calls api information
function getApi(cityName) {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=metric`;

//  change to json 
fetch(currentWeatherURL)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404")
        throw new Error("City not found");
      storeSearchHistory(cityName);
      displayCurrentWeather(data);
      fiveDayForecast(cityName);
    })
    .catch(error => {
      console.log("Error:", error);
      alert("City not found. Please try again.");
    });
}

// history 

//  current weather 

//  forecast weather 

// pushes the api functions ,including the search and history function.
function initForecast() {
  renderSearchHistory();
}

initForecast();