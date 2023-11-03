import NightsStayIcon from '@mui/icons-material/NightsStay'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WeatherServiceData } from '../api/backend/weatherTypes'
import { useBackend } from '../contexts/BackendContext'
import ShortForecast from '../components/weather/ShortForecast'
import LongForecast from '../components/weather/LongForecast'
import CurrentWeather from '../components/weather/CurrentWeather'

const Divider = () => <div className="mx-1 border-b-[1px] border-gray-400" />

type WeatherViewProps = {
  compactMode?: boolean
}

const Weather = ({ compactMode }: WeatherViewProps) => {
  const [state, setState] = useState<WeatherServiceData>(null)
  const backend = useBackend()
  const navigate = useNavigate()

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

  if (compactMode) {
    return (
      <div
        className="flex cursor-pointer flex-col gap-2"
        onClick={() => navigate('/weather')}
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

  return <>WEATHER VIEW - WIP</>
}

export default Weather
