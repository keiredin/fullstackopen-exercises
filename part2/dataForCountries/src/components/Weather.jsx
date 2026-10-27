import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  
  // Vite exposes environment variables through import.meta.env
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    // Only fetch if a capital is provided
    if (capital) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
      
      axios.get(url).then(response => {
        setWeather(response.data)
      })
    }
  }, [capital, apiKey])

  // Do not render anything until the API response arrives
  if (!weather) {
    return null
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature - {weather.main.temp} Celcius</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
        alt={weather.weather[0].description} 
      />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather