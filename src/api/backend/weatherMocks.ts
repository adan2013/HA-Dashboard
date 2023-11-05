import {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
  WeatherServiceData
} from './weatherTypes'

export const currentWeatherMock: CurrentWeather = {
  sunrise: new Date('2023-12-31T09:53:00').getTime(),
  sunset: new Date('2023-12-31T14:07:00').getTime(),
  temp: 20.0,
  feelsLike: 19.1,
  humidity: 80,
  pressure: 1012,
  uvi: 1,
  aqi: 2,
  windSpeed: 5.4,
  windDeg: 90,
  weather: {
    type: 'Sun',
    icon: '01d'
  }
}

export const hourlyForecastMock: HourlyWeather[] = [
  {
    timestamp: new Date('2023-12-31T23:00:00').getTime(),
    temp: 23.1,
    feelsLike: 123.9,
    windSpeed: 1.2,
    pop: 8,
    weather: {
      type: 'Clouds',
      icon: '23d'
    }
  },
  {
    timestamp: new Date('2024-01-01T00:00:00').getTime(),
    temp: 24.1,
    feelsLike: 124.9,
    windSpeed: 12.3,
    pop: 16,
    weather: {
      type: 'Rain',
      icon: '24d'
    }
  },
  {
    timestamp: new Date('2024-01-01T01:00:00').getTime(),
    temp: 25.1,
    feelsLike: 125.9,
    windSpeed: 23.4,
    pop: 24,
    weather: {
      type: 'Fog',
      icon: '25d'
    }
  }
]

export const dailyForecastMock: DailyWeather[] = [
  {
    timestamp: new Date('2023-12-31T10:00:00').getTime(),
    dayTemp: 23.1,
    nightTemp: 23.9,
    windSpeed: 1.2,
    pop: 8,
    weather: {
      type: 'Clouds',
      icon: '23d'
    }
  },
  {
    timestamp: new Date('2024-01-01T10:00:00').getTime(),
    dayTemp: 24.1,
    nightTemp: 24.9,
    windSpeed: 12.3,
    pop: 16,
    weather: {
      type: 'Rain',
      icon: '24d'
    }
  },
  {
    timestamp: new Date('2024-01-02T10:00:00').getTime(),
    dayTemp: 25.1,
    nightTemp: 25.9,
    windSpeed: 23.4,
    pop: 24,
    weather: {
      type: 'Fog',
      icon: '25d'
    }
  }
]

export const weatherServiceDataMock: WeatherServiceData = {
  timestamp: new Date('2023-12-31T23:00:00').getTime(),
  city: 'Warsaw',
  current: currentWeatherMock,
  shortForecast: hourlyForecastMock,
  longForecast: dailyForecastMock
}
