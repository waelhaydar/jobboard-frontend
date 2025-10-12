'use client'

import React, { useState, useEffect, FC } from 'react'

interface WeatherData {
  name: string
  main: {
    temp: number
  }
  weather: {
    description: string
    icon: string
  }[]
}

const WeatherWidget: FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  const defaultCity = 'Beirut'

  useEffect(() => {
    if (!apiKey) {
      setError('API key is missing. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY environment variable.')
      setLoading(false)
      return
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?q=' + defaultCity + '&units=metric&appid=' + apiKey
        )
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }
        const data = await response.json()
        setWeather(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [apiKey])

  if (loading) {
    return <div className="p-4 bg-job-fill-background rounded-lg text-job-text-primary">Loading weather...</div>
  }

  if (error) {
    return <div className="p-4 bg-job-error-bg rounded-lg text-job-error-text">Error: {error}</div>
  }

  if (!weather) {
    return null
  }

  const iconUrl = 'https://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'

  const isDay = weather.weather[0].icon.endsWith('d')

  return (
    <div className="relative w-48 h-48 mx-auto bg-job-widget-background backdrop-blur-md border border-job-widget-border overflow-hidden flex items-center justify-center text-job-text-white">
      {/* Earth texture effect */}
      {/* Removed green gradient overlay for black glass effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent"></div> */}

      {/* Sun or Moon */}
      <div className={`absolute top-4 right-4 w-8 h-8 ${isDay ? 'text-job-weather-sun' : 'text-job-weather-moon'} opacity-80`}>
        {isDay ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </div>

      {/* Weather Content */}
      <div className="text-center z-10">
        <h3 className="text-sm font-semibold mb-1 opacity-90">{weather.name}</h3>
        <img
          src={iconUrl}
          alt={weather.weather[0].description}
          className="w-10 h-10 mx-auto mb-1 drop-shadow-lg"
          onError={(e) => {
            e.currentTarget.src = '/default-weather-icon.png'; // Replace with a default weather icon
          }}
        />
        <p className="text-xl font-bold">{Math.round(weather.main.temp)}&deg;C</p>
        <p className="text-xs capitalize opacity-90">{weather.weather[0].description}</p>
      </div>

      {/* Floating particles for cool effect */}
      <div className="absolute top-6 left-6 w-2 h-2 bg-job-weather-particle-light rounded-full animate-pulse"></div>
      <div className="absolute bottom-8 right-8 w-1 h-1 bg-job-weather-particle-dark rounded-full animate-bounce"></div>
    </div>
  )
}

export default WeatherWidget
