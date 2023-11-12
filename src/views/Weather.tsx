import NightsStayIcon from '@mui/icons-material/NightsStay'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { WeatherServiceData } from '../api/backend/weatherTypes'
import { useBackend } from '../contexts/BackendContext'
import ShortForecast from '../components/weather/compact/ShortForecast'
import LongForecast from '../components/weather/compact/LongForecast'
import CurrentWeather from '../components/weather/compact/CurrentWeather'

const COMPACT_MODE_BREAKPOINT = 800

const Divider = () => <div className="mx-1 border-b-[1px] border-gray-400" />

type WeatherViewProps = {
  isWidget?: boolean
}

const Weather = ({ isWidget }: WeatherViewProps) => {
  const [compactMode, setCompactMode] = useState<boolean>(true)
  const [state, setState] = useState<WeatherServiceData>(null)
  const backend = useBackend()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = backend?.subscribeToServiceData(data => {
      if (data?.weather) {
        setState(data.weather)
      }
    })
    const onResize = () =>
      setCompactMode(window.innerWidth < COMPACT_MODE_BREAKPOINT)
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      unsubscribe()
    }
  }, [backend])

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

  if (isWidget || compactMode) {
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
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="mx-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-700">1</div>
          <div className="bg-yellow-700">2</div>
          <div className="bg-yellow-700">3</div>
          <div className="bg-yellow-700">4</div>
          <div className="bg-yellow-700">5</div>
          <div className="bg-yellow-700">6</div>
          <div className="bg-yellow-700">7</div>
        </div>
      </div>
    </div>
  )
}

export default Weather
