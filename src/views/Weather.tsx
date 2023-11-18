import NightsStayIcon from '@mui/icons-material/NightsStay'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { WeatherServiceData } from '../api/backend/weatherTypes'
import { useBackend } from '../contexts/BackendContext'
import ShortForecast from '../components/weather/compact/ShortForecast'
import LongForecast from '../components/weather/compact/LongForecast'
import CurrentWeather from '../components/weather/compact/CurrentWeather'
import { useLayoutContext } from '../contexts/OutletContext'
import UvIndexTile from '../components/weather/full/UvIndexTile'
import AirQualityIndexTile from '../components/weather/full/AirQualityIndexTile'
import HumidityTile from '../components/weather/full/HumidityTile'
import TemperatureHistoryTile from '../components/weather/full/TemperatureHistoryTile'
import WindDirectionTile from '../components/weather/full/WindDirectionTile'
import PressureTile from '../components/weather/full/PressureTile'
import WindTile from '../components/weather/full/WindTile'
import SunTile from '../components/weather/full/SunTile'
import CurrentWeatherTile from '../components/weather/full/CurrentWeatherTile'
import RainRadarTile from '../components/weather/full/RainRadarTile'
import TableForecastView, {
  longForecastParams,
  shortForecastParams
} from '../components/weather/full/TableForecastView'
import { getDayOfWeekName } from '../components/weather/utils'
import { addLeadingZero } from '../utils/numberUtils'
import WindGustTile from '../components/weather/full/WindGustTile'
import DewPointTile from '../components/weather/full/DewPointTile'
import CloudsTile from '../components/weather/full/CloudsTile'
import VisibilityTile from '../components/weather/full/VisibilityTile'

const Divider = () => <div className="mx-1 border-b-[1px] border-gray-400" />

type WeatherViewProps = {
  isWidget?: boolean
}

const Weather = ({ isWidget }: WeatherViewProps) => {
  const [state, setState] = useState<WeatherServiceData>(null)
  const backend = useBackend()
  const navigate = useNavigate()
  const { isMobile } = useLayoutContext()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.weather) {
          setState(data.weather)
        }
      }),
    [backend]
  )

  if (!state) {
    return (
      <div className="text-md mt-20 text-center font-extrabold text-gray-500">
        <div className="mb-2">
          <NightsStayIcon className="!text-8xl" />
        </div>
        NO FORECAST AVAILABLE
      </div>
    )
  }

  if (isWidget || isMobile) {
    return (
      <div
        className={clsx('flex flex-col gap-2', isWidget && 'cursor-pointer')}
        onClick={isWidget ? () => navigate('/weather') : undefined}
      >
        <CurrentWeather data={state.current} />
        <Divider />
        <ShortForecast
          data={state.shortForecast}
          limit={18}
          sunrise={state.current.sunrise}
          sunset={state.current.sunset}
        />
        <Divider />
        <LongForecast data={state.longForecast} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mx-6">
        <div className="grid grid-cols-5 gap-4">
          <CurrentWeatherTile current={state.current} />
          <TemperatureHistoryTile history={state.historicalWeather.temp} />
          <UvIndexTile value={state.current.uvi} />
          <AirQualityIndexTile value={state.current.aqi} />
          <WindDirectionTile windDirection={state.current.windDeg} />
          <WindTile
            windSpeed={state.current.windSpeed}
            history={state.historicalWeather.windSpeed}
          />
          <RainRadarTile disableInteractions openModalOnClick />
          <DewPointTile value={state.current.dewPoint} />
          <HumidityTile value={state.current.humidity} />
          <WindGustTile value={state.current.windGust} />
          <PressureTile
            current={state.current.pressure}
            history={state.historicalWeather.pressure}
          />
          <SunTile
            sunrise={state.current.sunrise}
            sunset={state.current.sunset}
          />
          <CloudsTile value={state.current.clouds} />
          <VisibilityTile value={state.current.visibility} />
        </div>
        <TableForecastView
          data={state.shortForecast}
          params={shortForecastParams}
          headerRenderer={date =>
            `${addLeadingZero(date.getHours())}:${addLeadingZero(
              date.getMinutes()
            )}`
          }
          limit={24}
        />
        <TableForecastView
          data={state.longForecast}
          params={longForecastParams}
          headerRenderer={date =>
            `${getDayOfWeekName(date)} ${addLeadingZero(date.getDate())}`
          }
        />
        <div className="py-4 text-center font-light text-gray-300">
          Last update at: {new Date(state.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export default Weather
