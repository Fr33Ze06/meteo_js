const apiKey = '6eb1180161eccb06843669dbee0f87b3';
const weatherContainer = document.getElementById('weather-container');
const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const pressureElement = document.getElementById('pressure');
const windSpeedElement = document.getElementById('wind-speed');
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');

cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  getWeatherData(city);
});

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (response.ok) {
      const data = await response.json();
      updateWeatherUI(data);
    } else {
      throw new Error('Erreur lors de la récupération des données météorologiques.');
    }
  } catch (error) {
    console.log(error);
  }
}

function updateWeatherUI(data) {
  const cityName = data.name;
  const temperature = data.main.temp;
  const pressure = data.main.pressure;
  const windSpeed = data.wind.speed;

  cityNameElement.textContent = cityName;
  temperatureElement.textContent = `Température : ${temperature}°C`;
  pressureElement.textContent = `Pression : ${pressure} hPa`;
  windSpeedElement.textContent = `Vitesse du vent : ${windSpeed} m/s`;

  weatherContainer.style.display = 'block';
}

// Récupérer les éléments des villes
var villes = document.getElementsByClassName("ville");

// Parcourir les villes pour ajouter les événements
for (var i = 0; i < villes.length; i++) {
  var ville = villes[i];
  ville.addEventListener("mouseover", afficherInfos);
  ville.addEventListener("mouseout", cacherInfos);
}

// Fonction d'affichage des informations
function afficherInfos(event) {
  var ville = event.target;
  var nom = ville.getAttribute("data-nom");
  var info = ville.getAttribute("data-info");
  
  var infosDiv = document.getElementById("infos");
  infosDiv.innerHTML = "<h3>" + nom + "</h3><p>" + info + "</p>";
  infosDiv.style.display = "block";
}

// Fonction de masquage des informations
function cacherInfos() {
  var infosDiv = document.getElementById("infos");
  infosDiv.style.display = "none";
}
