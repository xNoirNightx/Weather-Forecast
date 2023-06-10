//  api key
const APIKey = "553423b9a7c722184334c598bb74ab66";
// variables
const cityForm = $("#city-form");
const citySearchInput = $("#city-search");
const currentWeatherContainer = $("#current-weather");
const fiveDayContainer = $("#five-day");
const searchHistoryContainer = $("#search-history");

cityForm.submit(function (event) {
  event.preventDefault();
  const cityName = citySearchInput.val().trim();
  if (cityName) {
    getApi(cityName);
    citySearchInput.val("");
  }
});
