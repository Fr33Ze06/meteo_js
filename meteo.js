document.addEventListener("DOMContentLoaded", function() {
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
    ];
    
  
    cities.forEach(function(city) {
      var marker = L.marker([city.lat, city.lon]).addTo(map);
      marker.on('click', function() {
        getWeatherData(city.name);
      });
    });
  });