//https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format - 12 hour format

//https://www.convertsimple.com/convert-json-to-javascript/ - convertator

//https://api.openweathermap.org/data/2.5/find?q=London&units=metric&appid=7f79f3f62c2158a047cee66e08953253
//7f79f3f62c2158a047cee66e08953253 - my key, which i must write in link section appid=

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { btnAdd, btnDelete } from "./module.js";

//Init
let inputCity = document.querySelector(".city-​​search");
let arrWeatherLayout = [];
let weatherLayoutCount = 0;

//localStorage.clear();

/**************************************************** */

getDataFromStorage();

displayWeatherLayouts();

//Btn Add - weather in the city
btnAdd.addEventListener("click", () => {
  if (weatherLayoutCount < 10) {
    createWeatherLayout();
    weatherLayoutCount++;
  } else {
    alert("Overcrowded");
  }
});

//Btn Delete - weather in the city
btnDelete.addEventListener("click", () => {
  alert("You need refresh web-site");
  localStorage.clear();
});

//Pobierania(Take/dowland) api
async function fetchWeatherApi() {
  let weatherData = {};

  try {
    const response = await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        inputCity.value +
        "&units=metric&appid=7f79f3f62c2158a047cee66e08953253"
    )
      .then((response) => response.json())
      .then((data) => {
        weatherData.id = data["id"];
        weatherData.city = data["name"];
        weatherData.temp = Math.round(data["main"]["temp"]);
        weatherData.icon = data["weather"][0]["icon"];
        weatherData.description = data["weather"][0]["description"];
        arrWeatherLayout.push(weatherData);
        localStorage.setItem("weatherApi", JSON.stringify(arrWeatherLayout));
      })
      .then(() => createDisplayWeatherLayout(weatherData));
    //  let weatherApi = await response.json();
    console.log(weatherApi);
  } catch (error) {
    console.error(`Fetching data failed: ${error}`);
  }
}

//Get datas weather from local storage
function getDataFromStorage() {
  arrWeatherLayout = [];

  if (localStorage.getItem("weatherApi") == null) return;

  const data = JSON.parse(localStorage.getItem("weatherApi"));

  if (data.length == 0) return;

  for (let i = 0; i < data.length; i++) {
    arrWeatherLayout.push(data[i]);
  }
}

//Dispaly Weather Layouts
function displayWeatherLayouts() {
  for (let i = 0; i < arrWeatherLayout.length; i++) {
    createDisplayWeatherLayout(arrWeatherLayout[i]);
  }
}

//Сreates a weather layout and displays it
function createDisplayWeatherLayout(weatherData) {
  let dateTime = new Date();

  const mainBlock = document.querySelector(".main-block");

  const containerSomeWeatherLayout = document.createElement("div");
  containerSomeWeatherLayout.classList.add("container-some-weather-layout");

  const city = document.createElement("div");
  city.classList.add("city");
  city.innerHTML = weatherData.city;
  containerSomeWeatherLayout.appendChild(city);

  const iconWeather = document.createElement("div");
  iconWeather.classList.add("icon-weather");
  iconWeather.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.icon}@2x.png"/>`;
  containerSomeWeatherLayout.appendChild(iconWeather);

  const temp = document.createElement("div");
  temp.classList.add("temp");
  temp.innerHTML = weatherData.temp + "°";
  containerSomeWeatherLayout.appendChild(temp);

  const time = document.createElement("div");
  time.classList.add("time");
  time.innerHTML = dateTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }); //"12:00" + " AM";
  containerSomeWeatherLayout.appendChild(time);

  const description = document.createElement("div");
  description.classList.add("description");
  description.innerHTML = weatherData.description;
  containerSomeWeatherLayout.appendChild(description);

  const btnDeleteForWeatherLayout = document.createElement("button");
  btnDeleteForWeatherLayout.classList.add("btn-delete-for-weather-layout");
  const iconBtnDeleteForWeatherLayout = document.createElement("i");
  iconBtnDeleteForWeatherLayout.classList.add("material-symbols-outlined");
  iconBtnDeleteForWeatherLayout.innerHTML = "delete";
  btnDeleteForWeatherLayout.addEventListener("click", () =>
    deleteWeatherLayout(weatherData.id)
  );

  btnDeleteForWeatherLayout.appendChild(iconBtnDeleteForWeatherLayout);
  containerSomeWeatherLayout.appendChild(btnDeleteForWeatherLayout);

  mainBlock.appendChild(containerSomeWeatherLayout);
}

//Create weather layout
function createWeatherLayout() {
  fetchWeatherApi();
}

function deleteWeatherLayout(weatherId) {
  arrWeatherLayout = arrWeatherLayout.filter(item => item.id !== weatherId);
  localStorage.setItem("weatherApi", JSON.stringify(arrWeatherLayout));
  document.querySelector(".main-block").innerHTML = "";
  displayWeatherLayouts();
}

