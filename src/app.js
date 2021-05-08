
//date
let now = new Date();

let h5 = document.querySelector("h5");

let date = now.getDate();
let hours = now.getHours();
let minutes = now.getMinutes();
let year = now.getFullYear();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let month = months[now.getMonth()];


h5.innerHTML = `${day}, ${date} ${month} ${year}, ${hours}:${minutes}`;

//geolocalization
function showPosition(position){
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "93fd6b5a846a988fc71bbe304715eb3c";
  let apiUrlEnd = "http://api.openweathermap.org/data/2.5/weather?";
  let apiUrlPosition = `${apiUrlEnd}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlPosition).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}


let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);


//API weather

function showWeather(response) {

let findCities= document.querySelector("#cityNow");
findCities.innerHTML = response.data.name;


let temperature = Math.ceil(response.data.main.temp);
weatherElement1 = document.querySelector("#celsius");
weatherElement1.innerHTML = temperature;

celsiusTemperature = response.data.main.temp;

let descriptionElement = document.querySelector("#description");
descriptionElement.innerHTML = response.data.weather[0].description;



let humid =  Math.ceil(response.data.main.humidity);
weatherElement3 = document.querySelector("#humidity");
weatherElement3.innerHTML = `Humidity: ${humid}%`;

let windy = Math.ceil(response.data.wind.speed);
weatherElement4 = document.querySelector("#wind");
weatherElement4.innerHTML = `Wind: ${windy} km/h`;

let iconElement =  document.querySelector("#icon");
iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

getForecast(response.data.coord);

}




function findCity(city) {
let apiKey = "93fd6b5a846a988fc71bbe304715eb3c";
let searchLocation = document.querySelector("#search-text-input").value;
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(showWeather);
}


function newCity(event) {
event.preventDefault();
let city = document.querySelector("#search-text-input").value;
findCity(city);}


let chooseCity = document.querySelector("form");
chooseCity.addEventListener("submit", newCity);



//celsius and fahren


function showFahrenheitTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#celsius");
  
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitDegrees = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitDegrees);
}

function showCelsiusTemperature(event) {
  event.preventDefault();

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let tempElement = document.querySelector("#celsius");
  tempElement.innerHTML = Math.round(celsiusTemperature);
}


let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-temp");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-temp");
celsiusLink.addEventListener("click", showCelsiusTemperature);

//next days forecast
function formatDay(timestamp) {
let date = new Date(timestamp * 1000);
let day = date.getDay();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
return days[day];
}

function displayForecast (response) {
let forecast = response.data.daily;
let forecastElement = document.querySelector("#forecast");
let forecastHTML = `<div class="row">`;


forecast.forEach(function (forecastDay, index) {
  if (index > 0 && index < 6) { 
  forecastHTML = forecastHTML + 
  `<div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
          width="38"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}</span> |
          <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)} </span>
   </div>
   </div>`;}
});

          forecastHTML = forecastHTML + `</div>`;
          forecastElement.innerHTML = forecastHTML;

}

function getForecast(coordinates) {
  let apiKey = "93fd6b5a846a988fc71bbe304715eb3c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

