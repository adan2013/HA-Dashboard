export type WeatherState = {
  type: string
  icon: string
}

export type WeatherServiceData = {
  timestamp: number
  city: string
  current: {
    sunrise: number
    sunset: number
    temp: number
    feelsLike: number
    humidity: number
    pressure: number
    uvi: number
    aqi: number
    windSpeed: number
    windDeg: number
    weather: WeatherState
  }
  shortForecast: {
    timestamp: number
    temp: number
    feelsLike: number
    windSpeed: number
    pop: number
    weather: WeatherState
  }[]
  longForecast: {
    timestamp: number
    dayTemp: number
    nightTemp: number
    windSpeed: number
    pop: number
    weather: WeatherState
  }[]
}
