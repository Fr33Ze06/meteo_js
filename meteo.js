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

  cityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    the_city=""
    cityInput.classList.remove("not_found")

    cities.forEach(function(city) {
      if (city.name.toUpperCase() == cityInput.value.toUpperCase()){
        the_city = city;
      }
    });

    if (the_city != ""){
      var cityLatLng = L.latLng(the_city.lat, the_city.lon);
  
      if (currentMarker != null){
        map.removeLayer(currentMarker);
      }
  
      // Créez le marqueur
      var marker = L.marker(cityLatLng).addTo(map);
      currentMarker = marker; 
  
      updateActiveButton(btnToday);
      const city = cityInput.value;
      getWeatherData(city);
    }else{
      console.log("City not found")
      cityInput.classList.add("not_found");
    }

  });

  /******************* BOUTON J ************************/

  const btnToday = document.getElementById('btn-today');
  btnToday.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 0); //recupere la meteo d'auj (indice 0)
  });

  const btnTomorrow = document.getElementById('btn-tomorrow');
  btnTomorrow.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 1);
  });

  const btnDay2 = document.getElementById('btn-day2');
  btnDay2.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 2);
  });

  const btnDay3 = document.getElementById('btn-day3');
  btnDay3.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 3);
  });

  const btnDay4 = document.getElementById('btn-day4');
  btnDay4.addEventListener('click', function() {
    const city = cityInput.value;
    updateActiveButton(this);

    getWeatherData(city, 4);
  });

  const forecastButtons = document.querySelectorAll('.forecast-btn');
  forecastButtons.forEach(button => {
    button.addEventListener('click', function() {
      const city = cityInput.value;
      const dayIndex = parseInt(this.getAttribute('data-day')); // indice du jour à partir de l'attribut personnalisé
      updateActiveButton(button);
      getWeatherData(city, dayIndex);
    });
  });

  function updateActiveButton(activeButton) {
    forecastButtons.forEach(button => {
      button.classList.remove('active');
    });
    activeButton.classList.add('active');
  }

  /******************* RECUPERATION METEO ************************/

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
  
  /******************* AFFICHAGE INFO METEO ************************/

  function updateWeatherUI(data, dayIndex) {
    const cityName = data.city.name;
    const forecastList = data.list;
  
    cityNameElement.textContent = cityName;
  
    weatherContainer.innerHTML = '';
  
    // Vérifie si la liste des prévisions complète
    if (dayIndex < forecastList.length / 8) {
      const startIndex = dayIndex * 8;
      const endIndex = (dayIndex + 1) * 8;
      const forecastListSlice = forecastList.slice(startIndex, endIndex);
  
      //localisation en français
      DateTime.local().setLocale('fr');
  
      // Affiche les prévisions pour chaque heure du jour
      forecastListSlice.forEach(forecast => {
        const forecastDateTime = DateTime.fromSeconds(forecast.dt);
        const forecastTime = forecastDateTime.toFormat('cccc HH:mm');
        const forecastTemperature = forecast.main.temp;
        const forecastPressure = forecast.main.pressure;
        const forecastWindSpeed = forecast.wind.speed;
  
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item');
        forecastElement.innerHTML = `
          <h3>${forecastTime}</h3>
          <p>Température : ${forecastTemperature}°C</p>
          <p>Pression : ${forecastPressure} hPa</p>
          <p>Vitesse du vent : ${forecastWindSpeed} m/s</p>
        `;

        weatherContainer.appendChild(forecastElement);
      });
    } else {
      console.log('Indice de jour invalide');
    }
  }
  
  /******************* CONFIG MAP ************************/

  var map = L.map('map').setView([46.603354, 1.888334], 6); // centrer la map sur la france
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

  var cities = [
    { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
    { name: "Pékin", lat: 39.9042, lon: 116.4074 },
    { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
    { name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
    { name: "Singapour", lat: 1.3521, lon: 103.8198 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Melbourne", lat: -37.8136, lon: 144.9631 },
    { name: "Auckland", lat: -36.8485, lon: 174.7633 },
    { name: "Wellington", lat: -41.2865, lon: 174.7762 },
    { name: "Johannesburg", lat: -26.2041, lon: 28.0473 },
    { name: "Le Caire", lat: 30.0444, lon: 31.2357 },
    { name: "Marrakech", lat: 31.6295, lon: -7.9811 },
    { name: "Dubaï", lat: 25.2048, lon: 55.2708 },
    { name: "New Delhi", lat: 28.6139, lon: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { name: "Bangkok", lat: 13.7563, lon: 100.5018 },
    { name: "Hanoï", lat: 21.0285, lon: 105.8542 },
    { name: "Séoul", lat: 37.5665, lon: 126.9780 },
    { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
    { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
    { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
    { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
    { name: "Mexico", lat: 19.4326, lon: -99.1332 },
    { name: "Toronto", lat: 43.6532, lon: -79.3832 },
    { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
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
    { name: "Cherbourg", lat: 49.6412, lon: -1.6162 },
    { name: "Sophia Antipolis", lat: 43.6150, lon: 7.0516 },
    { name: "Orléans", lat: 47.9022, lon: 1.9099 },
    { name: "Angers", lat: 47.4784, lon: -0.5632 },
    { name: "Le Mans", lat: 48.0061, lon: 0.1832 },
    { name: "Tours", lat: 47.3941, lon: 0.6848 },
    { name: "Le Havre", lat: 49.4938, lon: 0.1077 },
    { name: "Rouen", lat: 49.4432, lon: 1.0999 },
    { name: "Nantes", lat: 47.2181, lon: -1.5528 },
    { name: "Brest", lat: 48.3904, lon: -4.4861 },
    { name: "Nancy", lat: 48.6921, lon: 6.1844 },
    { name: "Reims", lat: 49.2583, lon: 4.0317 },
    { name: "Nîmes", lat: 43.8367, lon: 4.3601 },
    { name: "Clermont-Ferrand", lat: 45.7772, lon: 3.0870 },
    { name: "Limoges", lat: 45.8336, lon: 1.2611 },
    { name: "La Rochelle", lat: 46.1603, lon: -1.1511 },
    { name: "Troyes", lat: 48.2975, lon: 4.0742 },
    { name: "Poitiers", lat: 46.5802, lon: 0.3400 },
    { name: "Monaco", lat: 43.7384, lon: 7.4246 },
    { name: "Aix-en-Provence", lat: 43.5297, lon: 5.4474 },
    { name: "Avignon", lat: 43.9493, lon: 4.8055 },
    { name: "Grenoble", lat: 45.1885, lon: 5.7245 },
    { name: "Belfort", lat: 47.6389, lon: 6.8649 },
    { name: "Metz", lat: 49.1193, lon:  6.1727 },
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
    { name: "Toronto", lat: 43.6532, lon: -79.3832 },
    { name: "Athènes", lat: 37.9838, lon: 23.7275 },
    { name: "Stockholm", lat: 59.3293, lon: 18.0686 },
    { name: "Oslo", lat: 59.9139, lon: 10.7522 },
    { name: "Helsinki", lat: 60.1699, lon: 24.9384 },
  ];

  //Gere la map du click et du marqueur
  map.on('click', function(e) {
    
    var clickedLatLng = e.latlng;

    // Parcourez la liste des villes pour vérifier si le clic correspond à une ville
    cities.forEach(function(city) {
      var cityLatLng = L.latLng(city.lat, city.lon);
      var distance = clickedLatLng.distanceTo(cityLatLng);

      if (distance < 50000) {
        if (currentMarker) {
          map.removeLayer(currentMarker);
        }

        // Créez le marqueur
        var marker = L.marker(cityLatLng).addTo(map);
        currentMarker = marker; 

        updateActiveButton(btnToday);
        cityInput.value = city.name;

        getWeatherData(city.name);
      }
    });
  });
});
