import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { Fragment, ReactElement, useMemo } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { HourlyWeather } from '../../../api/backend/weatherTypes'
import { addLeadingZero } from '../../../utils/numberUtils'
import { removePastHours } from './utils'

const ItemContainer = ({ children }: { children: ReactElement[] }) => (
  <div className="flex flex-col gap-1 rounded bg-gray-800 py-2">{children}</div>
)

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
    <ItemContainer>
      <div>{`${hrWithZero}:${minWithZero}`}</div>
      <div className="flex h-16 w-28 items-center justify-center">
        {isSunset ? (
          <DownloadIcon className="!text-[3rem]" />
        ) : (
          <UploadIcon className="!text-[3rem]" />
        )}
      </div>
      <div>{isSunset ? 'Sunset' : 'Sunrise'}</div>
    </ItemContainer>
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
    <div className="flex flex-row gap-2 overflow-auto py-1 text-center text-lg">
      {forecast.map(f => {
        const time = new Date(f.timestamp)
        return (
          <Fragment key={f.timestamp}>
            <SunPositionItem eventTime={sunriseTime} forecastTime={time} />
            <ItemContainer>
              <div>{addLeadingZero(time.getHours())}</div>
              <div className="flex h-16 w-28 items-center justify-center">
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
            </ItemContainer>
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
