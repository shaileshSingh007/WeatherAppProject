 


// API Configuration
const API_KEY = 'b9cfb1a798655c235698594be2c2a4ed'; // Replace with your OpenWeatherMap API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const ICON_URL = 'https://openweathermap.org/img/wn/';





// DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const locationButton = document.getElementById('location-btn');
const searchDropdown = document.getElementById('search-dropdown');
const weatherContainer = document.getElementById('weather-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const locationName = document.getElementById('location-name');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-container');

// Initialize recent searches from local storage
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners when the DOM is fully loaded
    searchButton.addEventListener('click', handleSearch);
    locationButton.addEventListener('click', getCurrentLocationWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Input focus event for dropdown
    cityInput.addEventListener('focus', showRecentSearches);
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!cityInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.add('hidden');
        }
    });
    
    // Handle input changes
    cityInput.addEventListener('input', () => {
        if (cityInput.value.trim() !== '') {
            showRecentSearches();
        } else {
            searchDropdown.classList.add('hidden');
        }
    });
});

// Handle the search button click
function handleSearch() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        showError('Please enter a city name');
        return;
    }
    
    getWeatherData(city);
}

// Get current location using Geolocation API
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        // Show loading state
        locationButton.innerHTML = '<div class="loading-spinner mx-auto"></div>';
        locationButton.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
                
                // Reset button
                locationButton.innerHTML = '<i class="fas fa-location-dot mr-2"></i>Current Location';
                locationButton.disabled = false;
            },
            (error) => {
                showError('Unable to retrieve your location. Please search by city name.');
                console.error('Geolocation error:', error);
                
                // Reset button
                locationButton.innerHTML = '<i class="fas fa-location-dot mr-2"></i>Current Location';
                locationButton.disabled = false;
            }
        );
    } else {
        showError('Geolocation is not supported by your browser. Please search by city name.');
    }
}

// Get weather data by city name
async function getWeatherData(city) {
    try {
        // Clear existing error
        hideError();
        
        // Show loading state
        searchButton.innerHTML = '<div class="loading-spinner mx-auto"></div>';
        searchButton.disabled = true;
        
        // Fetch current weather
        const weatherResponse = await fetch(`${WEATHER_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!weatherResponse.ok) {
            throw new Error(`City not found. Please check the spelling and try again.`);
        }
        
        const weatherData = await weatherResponse.json();
        
        // Fetch 5-day forecast
        const { lat, lon } = weatherData.coord;
        const forecastResponse = await fetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!forecastResponse.ok) {
            throw new Error('Error fetching forecast data');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Update UI
        displayWeatherData(weatherData);
        displayForecastData(forecastData);
        
        // Add to recent searches
        addToRecentSearches(city);
        
        // Show weather container
        weatherContainer.classList.remove('hidden');
        weatherContainer.classList.add('fade-in');
        
        // Reset button
        searchButton.textContent = 'Search';
        searchButton.disabled = false;
        
    } catch (error) {
        showError(error.message);
        
        // Reset button
        searchButton.textContent = 'Search';
        searchButton.disabled = false;
    }
}

// Get weather by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        // Clear existing error
        hideError();
        
        // Fetch current weather
        const weatherResponse = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!weatherResponse.ok) {
            throw new Error('Error fetching weather data for your location');
        }
        
        const weatherData = await weatherResponse.json();
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!forecastResponse.ok) {
            throw new Error('Error fetching forecast data for your location');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Update UI
        displayWeatherData(weatherData);
        displayForecastData(forecastData);
        
        // Show weather container
        weatherContainer.classList.remove('hidden');
        weatherContainer.classList.add('fade-in');
        
    } catch (error) {
        showError(error.message);
    }
}

// Display current weather data
function displayWeatherData(data) {
    locationName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `${ICON_URL}${data.weather[0].icon}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
}

// Display 5-day forecast
function displayForecastData(data) {
    // Clear previous forecast
    forecastContainer.innerHTML = '';
    
    // Process forecast data (we need to filter for one forecast per day)
    const dailyData = filterDailyForecast(data.list);
    
    // Create a card for each day
    dailyData.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayMonth = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'bg-white p-4 rounded-lg shadow weather-card';
        forecastCard.innerHTML = `
            <div class="text-center">
                <h3 class="font-bold text-lg">${dayName}</h3>
                <p class="text-gray-500 text-sm">${dayMonth}</p>
                <img src="${ICON_URL}${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}" class="mx-auto my-2">
                <p class="text-xl font-bold">${Math.round(forecast.main.temp)}°C</p>
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                    <div>
                        <i class="fas fa-wind mr-1"></i> ${forecast.wind.speed} m/s
                    </div>
                    <div>
                        <i class="fas fa-tint mr-1"></i> ${forecast.main.humidity}%
                    </div>
                </div>
            </div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Filter forecast data to get one forecast per day
function filterDailyForecast(forecastList) {
    const dailyForecasts = [];
    const processedDays = new Set();
    
    for (const forecast of forecastList) {
        const date = new Date(forecast.dt * 1000);
        const day = date.toDateString();
        
        // Skip current day and take only one forecast per day
        if (!processedDays.has(day) && date.getDate() !== new Date().getDate()) {
            dailyForecasts.push(forecast);
            processedDays.add(day);
            
            // Stop after getting 5 days
            if (dailyForecasts.length >= 5) {
                break;
            }
        }
    }
    
    return dailyForecasts;
}

// Add city to recent searches
function addToRecentSearches(city) {
    // Convert to title case for consistency
    const formattedCity = city.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    // Remove if already exists
    recentSearches = recentSearches.filter(search => search.toLowerCase() !== formattedCity.toLowerCase());
    
    // Add to beginning of array
    recentSearches.unshift(formattedCity);
    
    // Keep only the most recent 5 searches
    if (recentSearches.length > 5) {
        recentSearches = recentSearches.slice(0, 5);
    }
    
    // Save to local storage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// Show recent searches dropdown
function showRecentSearches() {
    if (recentSearches.length === 0) {
        searchDropdown.classList.add('hidden');
        return;
    }
    
    // Clear previous dropdown content
    searchDropdown.innerHTML = '';
    
    // Filter searches based on input
    const inputValue = cityInput.value.toLowerCase();
    const filteredSearches = recentSearches.filter(
        city => city.toLowerCase().includes(inputValue)
    );
    
    if (filteredSearches.length === 0) {
        searchDropdown.classList.add('hidden');
        return;
    }
    
    // Add each city to the dropdown
    filteredSearches.forEach(city => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = city;
        
        item.addEventListener('click', () => {
            cityInput.value = city;
            searchDropdown.classList.add('hidden');
            handleSearch();
        });
        
        searchDropdown.appendChild(item);
    });
    
    // Show dropdown
    searchDropdown.classList.remove('hidden');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
}

// Hide error message
function hideError() {
    errorContainer.classList.add('hidden');
} 

 