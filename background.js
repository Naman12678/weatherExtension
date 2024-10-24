const API_KEY = "81c19fcc223467f8611bbb4da22986c9";
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

// Function to get weather for multiple cities and display notifications
async function getWeatherAndNotify() {
    chrome.storage.local.get('cities', async function(result) {
        const cities = result.cities || ['London']; // Default city if not set
        console.log(`Fetching weather for cities: ${cities.join(', ')}`); // Log the cities being fetched

        for (let city of cities) {
            const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                // Log the data received from the API
                console.log(`Weather data for ${city}:`, data);

                if (data && data.main) {
                    const temp = data.main.temp;
                    const weather = data.weather[0].description;

                    const notificationOptions = {
                        type: 'basic',
                        iconUrl: 'weather_icon.png', // Ensure this image exists in your directory
                        title: `Weather in ${city}`,
                        message: `Current Temp: ${temp}°C\nWeather: ${weather}`
                    };

                    chrome.notifications.create(`weatherNotif_${city}`, notificationOptions);
                    console.log(`Notification created for ${city}`); // Log when a notification is created
                } else {
                    console.error(`No weather data for ${city}:`, data);
                }
            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        }
    });
}

// Set up an alarm to fetch weather every 30 minutes
chrome.alarms.create('weatherAlarm', { periodInMinutes: 0.5 });

// Listen for the alarm
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'weatherAlarm') {
        console.log('Weather alarm triggered'); // Log when the alarm triggers
        getWeatherAndNotify();
    }
});
