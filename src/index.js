import "./styles/styles.css";

//openweather nodes
const city = document.querySelector("#city");
const flag = document.querySelector("#flag");
const OWicon = document.querySelector("#OWicon");
const climate = document.querySelector("#climate");
const temp = document.querySelector("#temp");
const tempMax = document.querySelector("#tempMax");
const tempMin = document.querySelector("#tempMin");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");
const windSpeed = document.querySelector("#windSpeed");
const windDeg = document.querySelector("#windDeg");
const clouds = document.querySelector("#clouds");
const visibility = document.querySelector("#visibility");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");

//accesibility nodes
const textInput = document.querySelector(".search_bar");
const searchButton = document.querySelector(".search_button");
const mainContent = document.querySelector(".content_wrapper");
const popupTrigger = document.querySelector(".popup_button");
const popupHeader = document.querySelector(".popup_header");
const popupText = document.querySelector(".popup_content");
const loadingIcon = document.querySelector(".fa-globe");

//important functions and variables
let currentData; //fetched data
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function toggleLoadingIcon() {
  mainContent.classList.add("invisible");
  loadingIcon.classList.add("fa-fade");
  loadingIcon.classList.remove("invisible");
}
function showLoadingIcon() {
  loadingIcon.classList.remove("fa-fade");
  loadingIcon.classList.remove("invisible");
}
function hideLoadingIcon() {
  mainContent.classList.remove("invisible");
  loadingIcon.classList.remove("fa-fade");
  loadingIcon.classList.add("invisible");
}
function populateFields(data) {
  flag.src = `https://www.countryflagicons.com/FLAT/24/${data.sys.country}.png`;
  OWicon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  city.textContent = `${data.name} (${data.sys.country})`; //city and country code
  climate.textContent = `${capitalizeFirstLetter(data.weather[0].description)}`;
  temp.textContent = `${data.main.temp}°C`;
  tempMax.textContent = `${data.main.temp_max}°C`;
  tempMin.textContent = `${data.main.temp_min}°C`;
  humidity.textContent = `Humedad: ${data.main.humidity}%`;
  pressure.textContent = `Presión: ${data.main.pressure}hPa`;
  windSpeed.textContent = `Viento: ${data.wind.speed}km/hr`;
  windDeg.textContent = `Grados: ${data.wind.deg}°`;
  clouds.textContent = `Nubes: ${data.clouds.all}%`;
  visibility.textContent = `Visibilidad: ${data.visibility}m`;
  sunrise.textContent = `${formatDate(data.sys.sunrise)}`;
  sunset.textContent = `${formatDate(data.sys.sunset)}`;
}
function togglePopup(e) {
  popupHeader.textContent = e.name;
  popupText.textContent = `
          Es posible que actualmente no poseas conexión a internet o la ciudad
          que introdujiste no exista. Código: ${e.cause} con mensaje: ${e.message}`;
  popupTrigger.click();
}
function formatDate(date) {
  return new Date(date * 1000).toLocaleTimeString("en-US");
}
//main async function to work with the currentData variable
async function fetchCity(evt) {
  if (textInput.value !== "") {
    toggleLoadingIcon();
    try {
      //fetch
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${textInput.value}&appid=b723d411eb6d3c58c671e388083b128e&lang=es&units=metric`,
        { mode: "cors" }
      );
      if (!response.ok) {
        throw new Error(`${response.statusText}`, {
          cause: response.status,
        });
      } else {
        currentData = await response.json();
      }
    } catch (err) {
      //if got any error, toggle the popup
      togglePopup(err);
      showLoadingIcon();
      currentData = undefined;
    } finally {
      if (currentData) {
        populateFields(currentData);
        hideLoadingIcon();
      }
    }
  }
  return;
}
searchButton.addEventListener("click", fetchCity);
