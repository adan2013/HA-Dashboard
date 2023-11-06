import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { Fragment, useMemo } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { HourlyWeather } from '../../../api/backend/weatherTypes'
import { addLeadingZero } from '../../../utils/numberUtils'
import { removePastHours } from '../utils'

type SunPositionItemProps = {
  isSunset?: boolean
  eventTime: Date
  forecastTime: Date
}

const SunPositionItem = ({
  isSunset,
  eventTime,
  forecastTime
}: SunPositionItemProps) => {
  const hr = eventTime.getHours()
  const minWithZero = addLeadingZero(eventTime.getMinutes())
  const hrWithZero = addLeadingZero(eventTime.getHours())
  let shouldShow: boolean
  if (isSunset) {
    shouldShow = forecastTime.getHours() === hr
  } else {
    shouldShow = forecastTime.getHours() === hr + 1
  }
  if (!shouldShow) {
    return null
  }

  return (
    <div className="mx-4 my-1 rounded text-center">
      <div className="flex w-20 flex-col gap-1 text-lg">
        <div>{`${hrWithZero}:${minWithZero}`}</div>
        <div className="flex h-16 items-center justify-center">
          {isSunset ? (
            <DownloadIcon className="!text-[3rem]" />
          ) : (
            <UploadIcon className="!text-[3rem]" />
          )}
        </div>
        <div>{isSunset ? 'Sunset' : 'Sunrise'}</div>
      </div>
    </div>
  )
}

type ShortForecastProps = {
  data: HourlyWeather[]
  limit?: number
  sunrise?: number
  sunset?: number
}

const ShortForecast = ({
  data,
  limit,
  sunrise,
  sunset
}: ShortForecastProps) => {
  const forecast = useMemo(() => {
    const forecastWithoutPast = removePastHours(data)
    if (limit && forecastWithoutPast?.length > limit) {
      return forecastWithoutPast.slice(0, limit)
    }
    return forecastWithoutPast
  }, [data, limit])

  const sunriseTime = useMemo(() => new Date(sunrise), [sunrise])
  const sunsetTime = useMemo(() => new Date(sunset), [sunset])

  return (
    <div className="m-1 flex flex-row overflow-auto py-1">
      {forecast.map(f => {
        const time = new Date(f.timestamp)
        return (
          <Fragment key={f.timestamp}>
            <SunPositionItem eventTime={sunriseTime} forecastTime={time} />
            <div className="mx-4 my-1 text-center">
              <div className="flex w-20 flex-col gap-1 text-lg">
                <div>{addLeadingZero(time.getHours())}</div>
                <div className="flex h-16 items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${f.weather.icon}@2x.png`}
                    alt={f.weather.type}
                  />
                </div>
                <div>
                  {`${Math.round(f.temp)}°`}
                  <span className="ml-1 text-sm text-gray-200">{`(${Math.round(
                    f.feelsLike
                  )}°)`}</span>
                </div>
                <div className="flex flex-row justify-center gap-1">
                  {f.pop > 10 && <WaterDropIcon />}
                  {f.windSpeed >= 20 && <AirIcon />}
                </div>
              </div>
            </div>
            <SunPositionItem
              eventTime={sunsetTime}
              forecastTime={time}
              isSunset
            />
          </Fragment>
        )
      })}
    </div>
  )
}

export default ShortForecast
