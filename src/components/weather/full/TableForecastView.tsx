import { ReactElement, useMemo } from 'react'
import { ShortForecast, LongForecast } from '../../../api/backend/weatherTypes'
import { addLeadingZero } from '../../../utils/numberUtils'

type ForecastData = ShortForecast | LongForecast
type RendererFunc<T> = (value: T) => ReactElement | number | string
type Params<T> = { [key: string]: RendererFunc<T> }

const renderTimestamp = (timestamp: number) => {
  const time = new Date(timestamp)
  const h = addLeadingZero(time.getHours())
  const m = addLeadingZero(time.getMinutes())
  return `${h}:${m}`
}

export const shortForecastParams: Params<ShortForecast> = {
  Temperature: h => `${Math.round(h.temp)}°`,
  'Feels like': h => `${Math.round(h.temp)}°`,
  'Pressure (hPa)': f => Math.round(f.pressure),
  'Wind speed (km/h)': f => Math.round(f.windSpeed),
  'Wind gust (km/h)': f => Math.round(f.windGust),
  'Visibility (m)': f => Math.round(f.visibility),
  Clouds: f => `${f.clouds}%`,
  Precipitation: f => `${f.pop}%`,
  'UV index': f => Math.round(f.uvi)
}

export const longForecastParams: Params<LongForecast> = {
  'Day temperature': f => `${Math.round(f.dayTemp)}°`,
  'Night temperature': f => `${Math.round(f.nightTemp)}°`,
  'Temperature range': f =>
    `${Math.round(f.minTemp)}° / ${Math.round(f.maxTemp)}°`,
  'Pressure (hPa)': f => Math.round(f.pressure),
  'Wind speed (km/h)': f => Math.round(f.windSpeed),
  'Wind gust (km/h)': f => Math.round(f.windGust),
  Clouds: f => `${f.clouds}%`,
  Precipitation: f => `${f.pop}%`,
  'UV index': f => Math.round(f.uvi),
  Sunrise: f => renderTimestamp(f.sunrise),
  Sunset: f => renderTimestamp(f.sunset)
}

type Props = {
  data: ForecastData[]
  params: Params<ForecastData>
  headerRenderer: (date: Date) => string
  limit?: number
}

const TableForecastView = ({ data, params, headerRenderer, limit }: Props) => {
  const limitedData = useMemo(() => {
    if (limit && data.length > limit) {
      return data.slice(0, limit)
    }
    return data
  }, [data, limit])
  return (
    <div className="my-5 overflow-x-scroll rounded-lg bg-blue-900 text-center">
      <table>
        <thead>
          <tr>
            <td className="sticky left-0 bg-blue-950" />
            {limitedData.map(day => {
              const date = new Date(day.timestamp)
              return (
                <td key={day.timestamp}>
                  <div className="w-32 py-1">
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                      alt={day.weather.type}
                      className="mx-auto"
                    />
                    <div className="pb-2 font-bold">{headerRenderer(date)}</div>
                  </div>
                </td>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(params).map(([name, renderer]) => (
            <tr key={name}>
              <td className="sticky left-0 bg-blue-950">
                <div className="w-48 py-1 pl-4 text-left">{name}</div>
              </td>
              {limitedData.map(day => (
                <td key={day.timestamp}>{renderer(day)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableForecastView
