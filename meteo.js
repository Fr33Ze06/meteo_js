document.addEventListener("DOMContentLoaded", function() {
  const apiKey = '6eb1180161eccb06843669dbee0f87b3';
  const weatherContainer = document.getElementById('weather-container');
  const cityNameElement = document.getElementById('city-name');
  const temperatureElement = document.getElementById('temperature');
  const pressureElement = document.getElementById('pressure');
  const windSpeedElement = document.getElementById('wind-speed');
  const cityForm = document.getElementById('city-form');
  const cityInput = document.getElementById('city-input');
  const { DateTime } = window.luxon;
  let forecastList;
  let currentMarker = null;

  // Au début de votre code

  cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value;
    getWeatherData(city);
  });

  const btnToday = document.getElementById('btn-today');
  btnToday.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 0); // Utilisez l'indice 0 pour récupérer la météo d'aujourd'hui
  });

  // Écouteur d'événement pour le bouton "Demain"
  const btnTomorrow = document.getElementById('btn-tomorrow');
  btnTomorrow.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 1); // Utilisez l'indice 1 pour récupérer la météo de demain
  });

  // Écouteur d'événement pour le bouton "J+2"
  const btnDay2 = document.getElementById('btn-day2');
  btnDay2.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 2); // Utilisez l'indice 2 pour récupérer la météo du jour après demain
  });

  // Écouteur d'événement pour le bouton "J+3"
  const btnDay3 = document.getElementById('btn-day3');
  btnDay3.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 3); // Utilisez l'indice 3 pour récupérer la météo du jour suivant J+2
  });

  // Écouteur d'événement pour le bouton "J+4"
  const btnDay4 = document.getElementById('btn-day4');
  btnDay4.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 4); // Utilisez l'indice 4 pour récupérer la météo du jour suivant J+3
  });

  const forecastButtons = document.querySelectorAll('.forecast-btn');
  forecastButtons.forEach(button => {
    button.addEventListener('click', function() {
      const city = cityInput.value;
      const dayIndex = parseInt(this.getAttribute('data-day')); // Obtenez l'indice du jour à partir de l'attribut personnalisé
      updateActiveButton(button); // Mettez à jour la classe active du bouton
      getWeatherData(city, dayIndex);
    });
  });

  // Fonction pour mettre à jour la classe active du bouton
  function updateActiveButton(activeButton) {
    // Supprimez la classe active de tous les boutons
    forecastButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Ajoutez la classe active au bouton sélectionné
    activeButton.classList.add('active');
  }

  async function getWeatherData(city, dayIndex = 0) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );      
      if (response.ok) {
        const data = await response.json();
        forecastList = data.list;
        updateWeatherUI(data, dayIndex);
      } else {
        throw new Error('Erreur lors de la récupération des prévisions météorologiques.');
      }
    } catch (error) {
      console.log(error);
    }
  }
  

  function updateWeatherUI(data, dayIndex) {
    const cityName = data.city.name;
    const forecastList = data.list;
  
    cityNameElement.textContent = cityName;
  
    // Effacez les prévisions météorologiques précédentes
    weatherContainer.innerHTML = '';
  
    // Vérifiez si la liste des prévisions contient suffisamment d'éléments pour l'indice donné
    if (dayIndex < forecastList.length / 8) {
      const startIndex = dayIndex * 8;
      const endIndex = (dayIndex + 1) * 8;
      const forecastListSlice = forecastList.slice(startIndex, endIndex);
  
      // Définissez la localisation en français
      DateTime.local().setLocale('fr');
  
      // Affichez les prévisions pour chaque heure du jour sélectionné
      forecastListSlice.forEach(forecast => {
        const forecastDateTime = DateTime.fromSeconds(forecast.dt);
        const forecastTime = forecastDateTime.toFormat('cccc HH:mm'); // Format complet : jour de la semaine en français et heure
        const forecastTemperature = forecast.main.temp;
        const forecastPressure = forecast.main.pressure;
        const forecastWindSpeed = forecast.wind.speed;
  
        // Créez un élément HTML pour afficher les prévisions
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item'); // Ajoutez la classe CSS pour l'alignement horizontal
        forecastElement.innerHTML = `
          <h3>${forecastTime}</h3>
          <p>Température : ${forecastTemperature}°C</p>
          <p>Pression : ${forecastPressure} hPa</p>
          <p>Vitesse du vent : ${forecastWindSpeed} m/s</p>
        `;
  
        // Ajoutez l'élément des prévisions à l'interface utilisateur
        weatherContainer.appendChild(forecastElement);
      });
    } else {
      console.log('Indice de jour invalide');
    }
  }
  
  
  
  

  // Configuration de la carte
  var map = L.map('map').setView([46.603354, 1.888334], 6); // Coordonnées du centre de la France et niveau de zoom initial
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Ajout des marqueurs pour les villes
  var cities = [
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Marseille", lat: 43.2965, lon: 5.3698 },
    { name: "Lille", lat: 50.6292, lon: 3.0573 },
    { name: "Rennes", lat: 48.1173, lon: -1.6778 },
    { name: "Caen", lat: 49.1829, lon: -0.3707 },
    { name: "Bordeaux", lat: 44.8378, lon: -0.5792 },
    { name: "Toulouse", lat: 43.6047, lon: 1.4442 },
    { name: "Nice", lat: 43.7102, lon: 7.2620 },
    { name: "Strasbourg", lat: 48.5734, lon: 7.7521 },
    { name: "Lyon", lat: 45.75, lon: 4.85 },
    { name: "Montpellier", lat: 43.6110, lon: 3.8767 },
    { name: "Londres", lat: 51.5074, lon: -0.1278 },
    { name: "Madrid", lat: 40.4168, lon: -3.7038 },
    { name: "Barcelone", lat: 41.3851, lon: 2.1734 },
    { name: "Rome", lat: 41.9028, lon: 12.4964 },
    { name: "Berlin", lat: 52.5200, lon: 13.4050 },
    { name: "Amsterdam", lat: 52.3702, lon: 4.8952 },
    { name: "Milan", lat: 45.4642, lon: 9.1900 },
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "Miami", lat: 25.7617, lon: -80.1918 },
    { name: "Washington", lat: 38.9072, lon: -77.0369 },
    { name: "Valence", lat: 39.4699, lon: -0.3763 },
    { name: "Seville", lat: 37.3891, lon: -5.9845 },
    { name: "Porto", lat: 41.1579, lon: -8.6291 },
    { name: "Gibraltar", lat: 36.1408, lon: -5.3536 },
    { name: "Venise", lat: 45.4408, lon: 12.3155 },
    { name: "Florence", lat: 43.7696, lon: 11.2558 },
    { name: "Palerme", lat: 38.1157, lon: 13.3613 },
    { name: "Naples", lat: 40.8522, lon: 14.2681 },
    { name: "Berne", lat: 46.9480, lon: 7.4474 },
    { name: "Genève", lat: 46.2044, lon: 6.1432 },
    { name: "Dortmund", lat: 51.5136, lon: 7.4653 },
    { name: "Rotterdam", lat: 51.9225, lon: 4.47917 },
    { name: "Varsovie", lat: 52.2297, lon: 21.0122 },
    { name: "Prague", lat: 50.0755, lon: 14.4378 },
    { name: "Moscou", lat: 55.7512, lon: 37.6184 },
    { name: "Manchester", lat: 53.4830, lon: -2.2441 },
    { name: "Liverpool", lat: 53.4084, lon: -2.9916 },
    { name: "Seattle", lat: 47.6062, lon: -122.3321 },
    { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Las Vegas", lat: 36.1699, lon: -115.1398 },
    { name: "Birmingham", lat: 52.4862, lon: -1.8904 },
    { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
    { name: "Montreal", lat: 45.5017, lon: -73.5673 },
    { name: "Toronto", lat: 43.6532, lon: -79.3832 }
  ];

  map.on('click', function(e) {
    // Obtenez les coordonnées (latitude et longitude) du clic
    var clickedLatLng = e.latlng;
    // Modifier le curseur de la carte pour qu'il soit en forme de croix
    map.getContainer().classList.add('custom-cursor');

    // Supprimer le curseur personnalisé
    map.getContainer().classList.remove('custom-cursor');


    // Parcourez la liste des villes pour vérifier si le clic correspond à une ville
    cities.forEach(function(city) {
      var cityLatLng = L.latLng(city.lat, city.lon);

      // Calculez la distance entre les coordonnées du clic et les coordonnées de la ville
      var distance = clickedLatLng.distanceTo(cityLatLng);

      // Vérifiez si la distance est inférieure à 10000 mètres (10 kilomètres)
      if (distance < 10000) {
        // Supprimez le marqueur actuel s'il existe
        if (currentMarker) {
          map.removeLayer(currentMarker);
        }

        // Créez le marqueur pour la ville sélectionnée et obtenez les données météorologiques
        var marker = L.marker(cityLatLng).addTo(map);
        currentMarker = marker;

        getWeatherData(city.name);
      }
    });
  });
});
