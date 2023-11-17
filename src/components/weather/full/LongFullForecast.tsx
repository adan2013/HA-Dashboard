import { ReactElement } from 'react'
import { LongForecast } from '../../../api/backend/weatherTypes'
import { addLeadingZero } from '../../../utils/numberUtils'
import { getDayOfWeekName } from '../compact/utils'

const renderTimestamp = (timestamp: number) => {
  const time = new Date(timestamp)
  const h = addLeadingZero(time.getHours())
  const m = addLeadingZero(time.getMinutes())
  return `${h}:${m}`
}

type RendererFunc = (value: LongForecast) => ReactElement | number | string
const params: { [key: string]: RendererFunc } = {
  'Day temperature': d => `${Math.round(d.dayTemp)}°`,
  'Night temperature': d => `${Math.round(d.nightTemp)}°`,
  'Temperature range': d =>
    `${Math.round(d.minTemp)}° / ${Math.round(d.maxTemp)}°`,
  'Pressure (hPa)': d => Math.round(d.pressure),
  'Wind speed (km/h)': d => Math.round(d.windSpeed),
  'Wind gust (km/h)': d => Math.round(d.windGust),
  Clouds: d => `${d.clouds}%`,
  Precipitation: d => `${d.pop}%`,
  'UV index': d => Math.round(d.uvi),
  Sunrise: d => renderTimestamp(d.sunrise),
  Sunset: d => renderTimestamp(d.sunset)
}

type Props = {
  data: LongForecast[]
}

const LongFullForecast = ({ data }: Props) => (
  <div className="overflow-x-scroll rounded-lg bg-blue-900 text-center">
    <table>
      <thead>
        <tr>
          <td className="sticky left-0 bg-blue-950" />
          {data.map(day => {
            const time = new Date(day.timestamp)
            return (
              <td key={day.timestamp}>
                <div className="w-32 py-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                    alt={day.weather.type}
                    className="mx-auto"
                  />
                  <div className="pb-2 font-bold">
                    {`${getDayOfWeekName(time)} ${addLeadingZero(
                      time.getDate()
                    )}`}
                  </div>
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
            {data.map(day => (
              <td key={day.timestamp}>{renderer(day)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default LongFullForecast
