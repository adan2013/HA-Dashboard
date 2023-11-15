import NightsStayIcon from '@mui/icons-material/NightsStay'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { WeatherServiceData } from '../api/backend/weatherTypes'
import { useBackend } from '../contexts/BackendContext'
import ShortForecast from '../components/weather/compact/ShortForecast'
import LongForecast from '../components/weather/compact/LongForecast'
import CurrentWeather from '../components/weather/compact/CurrentWeather'
import Tile from '../components/basic/Tile'
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
          <TemperatureHistoryTile
            history={[23, 24, 25, 19, 18, 23, 24, 25, 19, 10, 4, -6]}
          />
          <UvIndexTile value={state.current.uvi} />
          <AirQualityIndexTile value={state.current.aqi} />
          <WindDirectionTile windDirection={45} />
          <WindTile
            windSpeed={state.current.windSpeed}
            history={[27, 33, 35, 34, 41, 41, 36, 35, 34, 0, 0, 19]}
          />
          <Tile title="Rain radar" size="big" />
          <Tile title="Storm radar" size="big" />
          <HumidityTile value={state.current.humidity} />
          <SunTile
            sunrise={state.current.sunrise}
            sunset={state.current.sunset}
          />
          <PressureTile
            current={1017}
            history={[
              1002, 1015, 990, 1022, 1008, 1011, 995, 1000, 1025, 988, 1018,
              1004
            ]}
          />
        </div>
        <div className="my-4 h-40 rounded-lg bg-blue-900 p-5 text-center">
          SHORT FORECAST
        </div>
        <div className="my-4 h-64 rounded-lg bg-blue-900 p-5 text-center">
          LONG FORECAST
        </div>
      </div>
    </div>
  )
}

export default Weather
