import NightsStayIcon from '@mui/icons-material/NightsStay'
import { useEffect, useState } from 'react'
import { WeatherServiceData } from '../api/backend/weatherTypes'
import { useBackend } from '../contexts/BackendContext'
import ShortForecast from '../components/weather/ShortForecast'
import LongForecast from '../components/weather/LongForecast'

type WeatherViewProps = {
  compactMode?: boolean
}

const Weather = ({ compactMode }: WeatherViewProps) => {
  const [state, setState] = useState<WeatherServiceData>(null)
  const backend = useBackend()

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
      <div className="flex flex-col gap-3">
        <ShortForecast
          data={state}
          limit={12}
          sunrise={state.current.sunrise}
          sunset={state.current.sunset}
        />
        <LongForecast data={state} />
      </div>
    )
  }

  return <>FULL VERSION - WIP</>
}

export default Weather
