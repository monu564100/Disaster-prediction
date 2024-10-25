// import React, { useState } from 'react';
// import { predictForestFire } from '../api/disasterPredictionApi';

// function ForestFirePrediction() {
//     const [oxygen, setOxygen] = useState('');
//     const [temperature, setTemperature] = useState('');
//     const [humidity, setHumidity] = useState('');
//     const [result, setResult] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = { oxygen, temperature, humidity };
//         const prediction = await predictForestFire(data);
//         setResult(prediction);
//     };

//     return (
//         <div>
//             <h2>Forest Fire Prediction</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>Oxygen Level:</label>
//                 <input type="text" value={oxygen} onChange={(e) => setOxygen(e.target.value)} />
//                 <br />
//                 <label>Temperature:</label>
//                 <input type="text" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
//                 <br />
//                 <label>Humidity:</label>
//                 <input type="text" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
//                 <br />
//                 <button type="submit">Predict</button>
//             </form>
//             {result && <p>Prediction Result: {result}</p>}
//         </div>
//     );
// }

// export default ForestFirePrediction;

import React, { useState, useEffect } from 'react';
import { predictForestFire } from '../api/disasterPredictionApi';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = 'f46bb950ecaff0330d647c15aea7f292';

function ForestFirePrediction() {
    const [oxygen, setOxygen] = useState(21); // Assuming oxygen level is constant at 21%
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [result, setResult] = useState(null);

    // Fetch weather data based on user's location
    useEffect(() => {
        const fetchWeatherData = async (lat, lon) => {
            try {
                const response = await fetch(
                    `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
                );
                if (!response.ok) {
                    throw new Error(`Weather API error: ${response.statusText}`);
                }
                const weatherData = await response.json();
                setTemperature(weatherData.main.temp);
                setHumidity(weatherData.main.humidity);

                // Automatically predict forest fire based on fetched weather data
                await fetchPrediction(21, weatherData.main.temp, weatherData.main.humidity);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        const fetchPrediction = async (oxygen, temperature, humidity) => {
            try {
                const data = { oxygen, temperature, humidity };
                const prediction = await predictForestFire(data);
                setResult(prediction === 'unsafe' ? 'Unsafe' : 'Safe');
            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        };

        const getLocationAndWeatherData = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherData(latitude, longitude);
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                    }
                );
            } else {
                console.error('Geolocation not supported by this browser.');
            }
        };

        getLocationAndWeatherData();
    }, []);

    return (
        <div>
            {/* <h2>Forest Fire Prediction</h2>
            <p>Oxygen Level: {oxygen}%</p>
            <p>Temperature: {temperature}°C</p>
            <p>Humidity: {humidity}%</p> */}
            <p>Prediction Result: {result ? result : 'Loading...'}</p>
        </div>
    );
}

export default ForestFirePrediction;
