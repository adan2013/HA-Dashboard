export type WeatherState = {
  type: string
  icon: string
}

export type CurrentWeather = {
  sunrise: number
  sunset: number
  temp: number
  feelsLike: number
  pressure: number
  humidity: number
  dewPoint: number
  uvi: number
  aqi: number
  clouds: number
  visibility: number
  windSpeed: number
  windDeg: number
  windGust: number
  weather: WeatherState
}

export type ShortForecast = {
  timestamp: number
  temp: number
  feelsLike: number
  pressure: number
  uvi: number
  clouds: number
  visibility: number
  windSpeed: number
  windGust: number
  pop: number
  weather: WeatherState
}

export type LongForecast = {
  timestamp: number
  sunrise: number
  sunset: number
  summary: string
  dayTemp: number
  nightTemp: number
  minTemp: number
  maxTemp: number
  pressure: number
  windSpeed: number
  windGust: number
  clouds: number
  pop: number
  uvi: number
  weather: WeatherState
}

export type HistoricalWeather = {
  temp: number[]
  windSpeed: number[]
  pressure: number[]
}

export type WeatherServiceData = {
  timestamp: number
  aqiStation: string
  current: CurrentWeather
  shortForecast: ShortForecast[]
  longForecast: LongForecast[]
  historicalWeather: HistoricalWeather
}
