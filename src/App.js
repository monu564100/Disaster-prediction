import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import axios from 'axios';  // Importing axios
import { fetchWeatherData } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';
import { getTodayForecastWeather, getWeekForecastWeather } from './utilities/DataUtils';
import './App.css'; // Importing CSS here
import ForestFirePrediction from './components/ForestFirePrediction';

const NEWS_API_KEY = '7J9jqTMFeqtzSIfNBQ36XjJUMHANlw9TbOHhQbNr'; // Your News API key

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [alertAreas, setAlertAreas] = useState([
    'Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir', 'Arunachal Pradesh'
  ]); // Sample high alert areas

  useEffect(() => {
    const fetchLocationWeather = async (lat, lon) => {
      setIsLoading(true);
      const currentDate = transformDateFormat();
      const date = new Date();
      let dt_now = Math.floor(date.getTime() / 1000);

      try {
        const [todayWeatherResponse, weekForecastResponse] = await fetchWeatherData(lat, lon);

        const all_today_forecasts_list = getTodayForecastWeather(
          weekForecastResponse,
          currentDate,
          dt_now
        );

        const all_week_forecasts_list = getWeekForecastWeather(
          weekForecastResponse,
          ALL_DESCRIPTIONS
        );

        setTodayForecast([...all_today_forecasts_list]);
        setTodayWeather({ city: 'Your Location', ...todayWeatherResponse });
        setWeekForecast({
          city: 'Your Location',
          list: all_week_forecasts_list,
        });
      } catch (error) {
        setError(true);
      }

      setIsLoading(false);
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(`https://api.thenewsapi.com/v1/news/all`, {
          params: {
            api_token: NEWS_API_KEY,
            language: 'en',
            search: alertAreas.join(', '), // Searching news for high alert areas
            limit: 5 // Get top 5 articles
          }
        });
        setNewsArticles(response.data.data); // Storing the fetched news articles
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationWeather(latitude, longitude);
        },
        (error) => {
          console.log('Error fetching location:', error);
          setError(true);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setError(true);
    }

    fetchNews(); // Fetching the news when the component mounts
  }, [alertAreas]);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] = await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(weekForecastResponse, currentDate, dt_now);

      const all_week_forecasts_list = getWeekForecastWeather(weekForecastResponse, ALL_DESCRIPTIONS);

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className="loading-content"
    >
      <SplashIcon className="splash-icon" />
      <Typography variant="h4" component="h4" className="splash-text">
        Explore current weather data and 6-day forecast of more than 200,000 cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <>
        <Grid item xs={12} md={6}>
          <TodayWeather data={todayWeather} forecastList={todayForecast} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box className="loading-box">
        <LoadingBox value="1">
          <Typography variant="h3" component="h3" className="loading-text">
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container className="app-container">
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" className="header">
            <Box component="img" className="logo" alt="logo" src={Logo} />
            <UTCDatetime />
            <Link href="https://github.com/YourGitHubProfile" target="_blank" underline="none" className="github-link">
              <GitHubIcon className="github-icon" />
            </Link>
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
        <Grid item xs={12} md={6}>
  <ForestFirePrediction />
</Grid>

        {/* News and High-Alert Areas Section */}
        <Grid item xs={12} md={6}>
  <Typography variant="h5" component="h5" className="high-alert-title">
    Top High Alert Areas in India
  </Typography>
  <Box className="high-alert-box">
    <ul>
      {alertAreas.map((area, index) => (
        <li key={index}>{area}</li>
      ))}
    </ul>
  </Box>
</Grid>

<Grid item xs={12} md={6}>
  <Typography variant="h5" component="h5" className="high-alert-title">
    Latest News Related to High Alert Areas
  </Typography>
  <Box className="high-alert-box">
    {newsArticles.length ? (
      <ul>
        {newsArticles.map((article, index) => (
          <li key={index}>
            <Link href={article.url} target="_blank">{article.title}</Link> - {article.published_at}
          </li>
        ))}
      </ul>
    ) : (
      <Typography className="no-news">No news available</Typography>
    )}
  </Box>
  </Grid>
  </Grid>
    </Container>
  );
}

export default App;
