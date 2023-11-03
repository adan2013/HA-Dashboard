export type WeatherState = {
  type: string
  icon: string
}

export type CurrentWeather = {
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

export type HourlyWeather = {
  timestamp: number
  temp: number
  feelsLike: number
  windSpeed: number
  pop: number
  weather: WeatherState
}

export type DailyWeather = {
  timestamp: number
  dayTemp: number
  nightTemp: number
  windSpeed: number
  pop: number
  weather: WeatherState
}

export type WeatherServiceData = {
  timestamp: number
  city: string
  current: CurrentWeather
  shortForecast: HourlyWeather[]
  longForecast: DailyWeather[]
}
