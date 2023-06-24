import React, { useState } from 'react';

class WeatherForecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forecastData: [],
      city: '',
      error: '',
      isLoading: false, 
    };
  }

  handleInputChange = (event) => {
    this.setState({ city: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { city } = this.state;
    const API_KEY = '1635890035cbba097fd5c26c8ea672a1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
    this.setState({ isLoading: true }); // Set isLoading to true

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === '200') {
          const forecast = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
          this.setState({ forecastData: forecast, error: '' });
        } else {
          this.setState({ error: data.message, forecastData: [] });
        }
      })
      .catch((error) => {
        this.setState({ error: 'Error fetching weather data', forecastData: [] });
      });
  };


  render() {
   
    const { forecastData, city, error } = this.state;

    return (
      
        <div> 
        <form onSubmit={this.handleSubmit}>
        <span className="weather-text">Weather in your city</span>
          <input
            type="text"
            value={city}
            onChange={this.handleInputChange}
            placeholder="Enter city name"
            className="city-input" 
          />
          <button type="submit" className="submit-button">Submit</button>
        
        </form>
        {error && <div>{error}</div>}
        {forecastData.length > 0 && (
          <div className="weather-forecast-container">
            {forecastData.map((forecast) => (
              <WeatherTable key={forecast.dt} forecast={forecast} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const WeatherTable = ({ forecast }) => {
  const date = new Date(forecast.dt * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const minTemp = Math.round(forecast.main.temp_min - 273.15);
  const maxTemp = Math.round(forecast.main.temp_max - 273.15);
  const pressure = forecast.main.pressure;
  const humidity = forecast.main.humidity;

  return (
  
    <table className="weather-table" >
      <thead>
        <tr>
          <th className="date-cell" colSpan="3">Date: {date}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan='2' align='center'>Temperature</td>
        </tr>
        <tr>
        <td>Min</td>
          <td>Max</td>
          </tr>
          <tr>
          <td>{minTemp}°C</td>
          <td>{maxTemp}°C</td>
        </tr>
        <tr>
          <td>Pressure</td>
          <td>{pressure} hPa</td>
        </tr>
        <tr>
          <td>Humidity</td>
          <td>{humidity}%</td>
        </tr>
      </tbody>
    </table>
 
  );
};

export default WeatherForecast;
