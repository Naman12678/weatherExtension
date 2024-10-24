document.getElementById('addCity').addEventListener('click', function() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (city) {
        chrome.storage.local.get('cities', function(result) {
            let cities = result.cities || [];
            if (!cities.includes(city)) {
                cities.push(city);
                chrome.storage.local.set({ cities });
                updateCityList(cities);
            }
        });
    }
    cityInput.value = ''; // Clear input
});

function updateCityList(cities) {
    const cityList = document.getElementById('cityList');
    cityList.innerHTML = '';
    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        cityList.appendChild(li);
    });
}

// On popup load, show stored cities
chrome.storage.local.get('cities', function(result) {
    const cities = result.cities || [];
    updateCityList(cities);
});

document.getElementById('viewWeather').addEventListener('click', function() {
    const weatherModal = document.getElementById('weatherModal');
    weatherModal.style.display = 'block'; // Show the modal
    fetchWeatherData(); // Fetch and display weather data
});

document.getElementById('closeModal').addEventListener('click', function() {
    const weatherModal = document.getElementById('weatherModal');
    weatherModal.style.display = 'none'; // Close the modal
});

function fetchWeatherData() {
    chrome.storage.local.get('cities', function(result) {
        const cities = result.cities || [];
        const weatherContainer = document.getElementById('weatherContainer');
        weatherContainer.innerHTML = ''; // Clear previous data

        cities.forEach(city => {
            // Replace with actual API call to fetch weather data
            const apiKey = '81c19fcc223467f8611bbb4da22986c9'; // Replace with your OpenWeather API key
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error fetching data for ${city}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const weatherData = {
                        temp: data.main.temp, // Temperature in Celsius
                        description: data.weather[0].description // Weather description
                    };
                    displayWeatherInfo(city, weatherData);
                })
                .catch(error => {
                    const errorItem = document.createElement('div');
                    errorItem.textContent = error.message; // Display error message
                    weatherContainer.appendChild(errorItem);
                });
        });
    });
}

function displayWeatherInfo(city, data) {
    const weatherContainer = document.getElementById('weatherContainer');
    const weatherItem = document.createElement('div');
    weatherItem.innerHTML = `<strong>${city}</strong>: ${data.temp}°C, ${data.description}`;
    weatherContainer.appendChild(weatherItem);
}
