const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = 'f46bb950ecaff0330d647c15aea7f292';

const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '4f0dcce84bmshac9e329bd55fd14p17ec6fjsnff18c2e61917',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

// Fetch weather data by latitude and longitude
export async function fetchWeatherData(lat, lon) {
  try {
    const weatherUrl = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const forecastUrl = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

    const [weatherPromise, forecastPromise] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    // Check if the responses are okay
    if (!weatherPromise.ok) {
      throw new Error(`Weather API error: ${weatherPromise.statusText}`);
    }
    if (!forecastPromise.ok) {
      throw new Error(`Forecast API error: ${forecastPromise.statusText}`);
    }

    const weatherResponse = await weatherPromise.json();
    const forecastResponse = await forecastPromise.json();

    return [weatherResponse, forecastResponse];
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return null; // Return null in case of error
  }
}

// Fetch cities by name prefix (for search functionality)
export async function fetchCities(input) {
  try {
    const response = await fetch(
      `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}`,
      GEO_API_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Geo API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    return null;
  }
}

// Automatically detect user location using browser's geolocation API and fetch weather
export async function fetchWeatherByAutoDetect() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await fetchWeatherData(latitude, longitude);
          resolve(weatherData); // Return the weather data for the user's location
        } catch (error) {
          console.error('Error fetching auto-detected weather data:', error);
          reject(error);
        }
      }, (error) => {
        console.error('Geolocation error:', error.message);
        reject(error); // Handle geolocation errors
      });
    });
  } else {
    console.error('Geolocation not supported by this browser.');
    return null;
  }
}
