# Weather Forecast Application

A responsive weather forecast application built with HTML, JavaScript, and Tailwind CSS. This application allows users to search for weather information by city name or get weather data for their current location.

## Features

- **Current Weather Display**: Shows temperature, feels-like temperature, humidity, wind speed, and weather condition with an appropriate icon.
- **5-Day Forecast**: Displays a 5-day weather forecast with essential information like temperature, humidity, and wind speed.
- **Search by City Name**: Users can search for weather information by entering a city name.
- **Current Location Weather**: Get weather information for your current location with a single click.
- **Recent Searches**: Recently searched cities are saved in local storage and displayed in a dropdown menu for quick access.
- **Responsive Design**: The application is fully responsive and works well on desktop, iPad Mini, and iPhone SE.
- **Error Handling**: Displays user-friendly error messages for invalid inputs or API errors.

## Screenshots

*Add screenshots of your application here*

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- JavaScript (ES6+)
- OpenWeatherMap API
- Font Awesome Icons
- Local Storage for saving recent searches

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd weather-forecast-app
   ```

2. **Get an API Key**
   - Create an account on [OpenWeatherMap](https://openweathermap.org/)
   - Generate an API key from your account dashboard
   - Replace `'YOUR_API_KEY'` in `script.js` with your actual API key

3. **Open the application**
   - You can either:
     - Open `index.html` directly in your browser
     - Use a local development server like Live Server in VS Code

## API Usage

The application uses two main endpoints from the OpenWeatherMap API:

1. **Current Weather Data**: `https://api.openweathermap.org/data/2.5/weather`
2. **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`

## Features Implementation Details

### Location-Based Forecast
- The application supports searching by city name through the search input field
- Current location weather is retrieved using the browser's Geolocation API
- Recent searches are stored in the browser's localStorage and displayed in a dropdown menu

### Extended Forecast Display
- The application fetches and displays a 5-day forecast using the OpenWeatherMap forecast API
- Each forecast card shows:
  - Day of the week
  - Date
  - Weather icon
  - Temperature
  - Wind speed
  - Humidity

### Error Handling
- The application handles API errors and displays user-friendly error messages
- Input validation prevents empty searches and provides feedback for invalid inputs

## Code Structure

- **index.html**: Main HTML structure
- **styles.css**: Custom CSS styles beyond Tailwind CSS
- **script.js**: JavaScript functionality for the weather application

## Future Improvements

- Add temperature unit conversion (Celsius/Fahrenheit)
- Include additional weather data like pressure, visibility, sunrise, and sunset times
- Add historical weather data visualization
- Implement PWA features for offline functionality
- Add dark/light mode toggle

## License

[MIT License](LICENSE)

## Acknowledgements

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- CSS framework by [Tailwind CSS](https://tailwindcss.com/) 