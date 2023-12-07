import {
  CurrentWeather,
  ShortForecast,
  LongForecast,
  WeatherServiceData
} from './weatherTypes'

export const currentWeatherMock: CurrentWeather = {
  sunrise: new Date('2023-12-31T09:53:00').getTime(),
  sunset: new Date('2023-12-31T14:07:00').getTime(),
  temp: 20.0,
  feelsLike: 19.1,
  pressure: 1012,
  humidity: 80,
  dewPoint: 2.1,
  uvi: 1,
  aqi: 2,
  clouds: 48,
  visibility: 9500,
  windSpeed: 5.4,
  windDeg: 90,
  windGust: 7.2,
  weather: {
    type: 'Sun',
    icon: '01d'
  }
}

export const hourlyForecastMock: ShortForecast[] = [
  {
    timestamp: new Date('2023-12-31T23:00:00').getTime(),
    temp: 23.1,
    feelsLike: 20.9,
    pressure: 1012,
    uvi: 1,
    clouds: 44,
    visibility: 200,
    windSpeed: 27.2,
    windGust: 32.4,
    pop: 8,
    weather: {
      type: 'Clouds',
      icon: '23d'
    }
  },
  {
    timestamp: new Date('2024-01-01T00:00:00').getTime(),
    temp: 27.1,
    feelsLike: 31.1,
    pressure: 1020,
    uvi: 3,
    clouds: 2,
    visibility: 9400,
    windSpeed: 1.2,
    windGust: 1.9,
    pop: 0,
    weather: {
      type: 'Sun',
      icon: '01d'
    }
  },
  {
    timestamp: new Date('2024-01-01T01:00:00').getTime(),
    temp: 3.1,
    feelsLike: -2.2,
    pressure: 987,
    uvi: 0,
    clouds: 98,
    visibility: 51,
    windSpeed: 22.2,
    windGust: 31.4,
    pop: 70,
    weather: {
      type: 'Snow',
      icon: '76d'
    }
  }
]

export const dailyForecastMock: LongForecast[] = [
  {
    timestamp: new Date('2023-12-31T10:00:00').getTime(),
    sunrise: new Date('2023-12-31T09:53:00').getTime(),
    sunset: new Date('2023-12-31T14:07:00').getTime(),
    summary: 'summary1',
    dayTemp: 23.1,
    nightTemp: 23.9,
    minTemp: 20.5,
    maxTemp: 25.1,
    pressure: 1015,
    windSpeed: 1.2,
    windGust: 5.4,
    clouds: 44,
    pop: 8,
    uvi: 1,
    weather: {
      type: 'Clouds',
      icon: '23d'
    }
  },
  {
    timestamp: new Date('2024-01-01T10:00:00').getTime(),
    sunrise: new Date('2023-01-01T09:45:00').getTime(),
    sunset: new Date('2023-01-01T14:11:00').getTime(),
    summary: 'summary2',
    dayTemp: 21.5,
    nightTemp: 16.1,
    minTemp: 15.4,
    maxTemp: 24.7,
    pressure: 1001,
    windSpeed: 3.2,
    windGust: 6.4,
    clouds: 21,
    pop: 4,
    uvi: 2,
    weather: {
      type: 'Sun',
      icon: '01d'
    }
  },
  {
    timestamp: new Date('2024-01-02T10:00:00').getTime(),
    sunrise: new Date('2023-01-02T09:35:00').getTime(),
    sunset: new Date('2023-01-02T13:54:00').getTime(),
    summary: 'summary3',
    dayTemp: 3.5,
    nightTemp: -2.4,
    minTemp: -4,
    maxTemp: 5.2,
    pressure: 1023,
    windSpeed: 0.2,
    windGust: 1.2,
    clouds: 0,
    pop: 0,
    uvi: 1,
    weather: {
      type: 'Mist',
      icon: '64d'
    }
  }
]

export const weatherServiceDataMock: WeatherServiceData = {
  timestamp: new Date('2023-12-31T23:00:00').getTime(),
  aqiStation: 'AirQualityStationName',
  current: currentWeatherMock,
  shortForecast: hourlyForecastMock,
  longForecast: dailyForecastMock,
  historicalWeather: {
    temp: [4, 8, 1, -2, 0, 1],
    windSpeed: [10, 12, 3, 0, 5, 7],
    pressure: [1004, 1011, 1005, 1006, 1010, 1011]
  }
}
