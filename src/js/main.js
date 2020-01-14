//Fixed header
window.onscroll = function showHeader() {
	let header = document.querySelector(".header__fixed");
    if(window.pageYOffset < 300){
        header.classList.add("header_glue");
    } else{
        header.classList.remove("header_glue");
    }
}

//Weather API
const mainIconElements = document.querySelectorAll(".weather-app__icon");
const tempElement = document.querySelector(".weather-app__left-degrees");
const descElement = document.querySelector(".weather-app__left-description");
const locationElement = document.querySelector(".weather-app__location");
const notificationElement = document.querySelector(".notification");
const windElem = document.querySelector(".wind");
//Search
const searchElement = document.querySelector('.weather-forecast__input')

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS 
const KELVIN = 273;

// API KEY
const key = "0e087257f53f9f784e9021fb9ecaff0a";

// Check if browser supports geolocation
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// Set user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// 
function getNow() {
    const today = new Date();
    const month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    const date = `${today.getDate()}th ${(month[today.getMonth()])} ${today.getFullYear()},`;
    const dateTime = date +' ';
    return this.timestamp = dateTime;
}
// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get weather from API provider
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.speed = Math.floor(data.wind.speed);
        })
        .then(function(){
            displayWeather();
        });
}

// Display weather to UI
function displayWeather(){
	mainIconElements.forEach(function(item, i, arr) {
		mainIconElements[i].innerHTML = `<img src="images/icons/${weather.iconId}.png"/>`;
	}); 
    tempElement.innerHTML = `${weather.temperature.value}°`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${getNow()} ${weather.city}, ${weather.country}`;
    windElem.innerHTML = `${weather.speed} <span>m/s<span>`;
}

// Get weather from input 
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0]
  if (place == null) return
  const latitudeSearch = place.geometry.location.lat()
  const longitudeSearch = place.geometry.location.lng()
  getWeather(latitudeSearch, longitudeSearch);
})  















