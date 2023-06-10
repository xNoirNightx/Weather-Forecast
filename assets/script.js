//  api key
const APIKey = "553423b9a7c722184334c598bb74ab66";


// variables
const cityForm = $("#city-form");
const citySearchInput = $("#city-search");
const searchHistoryContainer = $("#search-history");
const currentWeatherContainer = $("#current-weather");
const fiveDayContainer = $("#five-day");



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
function storeSearchHistory(cityName) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}
function renderSearchHistory() {
  searchHistoryContainer.empty();
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  for (let i = searchHistory.length - 1; i >= 0; i--) {
    const searchBtn = `<button type="button" class="history-btn" data-search="${searchHistory[i]}">${searchHistory[i]}</button>`;
    searchHistoryContainer.append(searchBtn);
  }
  if (searchHistory.length > 0) {
    const clearHistoryBtn = `<button type="button" id="clear-history-button" class="btn btn-danger">Clear History</button>`;
    searchHistoryContainer.append(clearHistoryBtn);
  }
}


//  current weather 
function displayCurrentWeather(data) {
  currentWeatherContainer.empty();
  const cityName = data.name;
  const currentDate = dayjs().format("MMM DD, YYYY");
  const weatherIcon = data.weather[0].icon;
  const temperature = data.main.temp;
  const windSpeed = data.wind.speed;
  const humidity = data.main.humidity;
  const currentWeatherElement = `
    <h2>${cityName} (${currentDate}) <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Wind Speed: ${windSpeed} km/h</p>
    <p>Humidity: ${humidity} %</p>
  `;
  currentWeatherContainer.append(currentWeatherElement);
}


//  forecast weather 
function fiveDayForecast(cityName) {
  fiveDayContainer.empty();
  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=metric`;
  fetch(fiveDayURL)
    .then(response => response.json())
    .then(data => {
      const fiveDayArray = data.list;
      for (let i = 0; i < fiveDayArray.length; i += 8) {
        const currentForecastIndex = fiveDayArray[i];
        const forecastDate = dayjs(currentForecastIndex.dt_txt).format("MMM DD, YYYY");
        const forecastIcon = currentForecastIndex.weather[0].icon;
        const forecastTemp = currentForecastIndex.main.temp;
        const forecastWind = currentForecastIndex.wind.speed;
        const forecastHumidity = currentForecastIndex.main.humidity;
        const forecastElement = `
          <div class="col-2 border border-secondary m-1 bg-dark text-white">
            <p>${forecastDate}</p>
            <p><img src="https://openweathermap.org/img/wn/${forecastIcon}.png"></img></p>
            <p>Temp: <span>${forecastTemp}°C</span></p>
            <p>Wind: <span>${forecastWind} km/h</span></p>
            <p>Humidity: <span>${forecastHumidity} %</span></p>
          </div>
        `;
        fiveDayContainer.append(forecastElement);
      }
    });
}


// pushes the api functions ,including the search and history function.
function initForecast() {
  renderSearchHistory();
}

initForecast();