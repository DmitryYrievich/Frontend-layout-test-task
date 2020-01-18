// Fixed header
let lastScrollTop = 0;
window.onscroll = () => {
  const header = document.querySelector(".header__fixed-wrap");
    let top = window.pageYOffset;
    if (lastScrollTop > top) {
        header.classList.add("header_glue");
    } else if (lastScrollTop < top) {
      header.classList.remove("header_glue");
    }
    lastScrollTop = top;
}

const getNow = () => {
    const today = new Date()
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return `${today.getDate()}th ${(months[today.getMonth()])} ${today.getFullYear()}`
}

// Get weather from API provider
const getWeather = (lat, lon) => {
    const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=0e087257f53f9f784e9021fb9ecaff0a`
    fetch(api).then(response => {
      response.json().then((data) => {
        const weather = {
          iconId: data.weather[0].icon,
          temperature: `${Math.floor(data.main.temp)}°`,
          description: data.weather[0].description,
          location: `${getNow()}, ${data.name}, ${data.sys.country}`,
          wind: `${Math.floor(data.wind.speed)} <span>m/s<span>`,
        }
        displayWeather(weather)
      })
    })
}

// Display weather to UI
const displayWeather = weather => {
    Array.from(document.querySelectorAll('.weather-app__icon')).forEach(item => {
        item.innerHTML = `<img src='images/${weather.iconId}.png'/>`
    })
    document.querySelector('.weather-app__left-degrees').innerHTML = weather.temperature
    document.querySelector('.weather-app__left-description').innerHTML = weather.description
    document.querySelector('.weather-app__location').innerHTML = weather.location
    document.querySelector('.wind').innerHTML = weather.wind
}

const notificationElement = document.querySelector('.notification')

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
    getWeather(position.coords.latitude, position.coords.longitude)
  }, error => {
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = `<p> ${error.message} </p>`
  })
} else {
  notificationElement.style.display = 'block'
  notificationElement.innerHTML = '<p>Browser doesn\'t Support Geolocation</p>'
}

// Get weather from input
const searchBox = new google.maps.places.SearchBox(document.querySelector('.weather-forecast__input'))

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0]
  if (place == null) return
  getWeather(place.geometry.location.lat(), place.geometry.location.lng())
})

// Accordion
const tabs = document.querySelectorAll(".frequently-questions__questions button");
const arrows = document.querySelectorAll(".arrow");

tabs.forEach(function(n) {
  n.onclick = function(){
    let panel = n.childNodes[4]
    let arrow = n.childNodes[2]
    if (panel.style.display != 'block') {
      panel.style.display = 'block';
      setTimeout(function () {
          panel.classList.remove('visuallyhidden');
        }, 10);
    } else {
      panel.style.display = 'none';
      panel.classList.add('visuallyhidden');
    }
    arrow.classList.toggle('active-arrow');
    n.classList.toggle('active');
  };
})