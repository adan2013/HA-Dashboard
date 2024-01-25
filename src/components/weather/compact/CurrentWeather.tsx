import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { cloneElement, ReactElement } from 'react'
import LightModeIcon from '@mui/icons-material/LightMode'
import BiotechIcon from '@mui/icons-material/Biotech'
import clsx from 'clsx'
import {
  CurrentWeather as CurrentWeatherType,
  ShortForecast
} from '../../../api/backend/weatherTypes'
import {
  getBarColorForAirQuality,
  getBarColorForRain,
  getBarColorForUltraViolet,
  getBarColorForWindSpeed
} from '../utils'

type WeatherParameterProps = {
  icon: ReactElement
  value: number | string
  barColor?: string
}

const WeatherParameter = ({ icon, value, barColor }: WeatherParameterProps) => (
  <div className="flex w-20 flex-col items-center gap-1">
    <div className="flex items-center gap-1">
      {cloneElement(icon, { className: '!text-[2rem]' })}
    </div>
    <div className="text-lg">{value}</div>
    <div className={clsx('h-2 w-full', barColor || 'bg-transparent')} />
  </div>
)

type CurrentWeatherProps = {
  data: CurrentWeatherType
  shortForecast?: ShortForecast[]
}

const CurrentWeather = ({ data, shortForecast }: CurrentWeatherProps) => (
  <div className="flex flex-row items-center gap-3 overflow-x-auto text-lg">
    <div className="min-w-[100px]">
      <img
        src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
        alt={data.weather.type}
      />
    </div>
    <div className="flex min-w-[100px] flex-col items-start gap-1">
      <div className="text-5xl">{Math.round(data.temp)}°</div>
      <div className="text-lg text-gray-200">
        Feels like {Math.round(data.feelsLike)}°
      </div>
    </div>
    <div className="flex-1">
      <div className="flex flex-row justify-end gap-2">
        {shortForecast && shortForecast.length > 0 && (
          <WeatherParameter
            icon={<WaterDropIcon />}
            value={`${Math.round(shortForecast[0].pop)}%`}
            barColor={getBarColorForRain(shortForecast[0].pop)}
          />
        )}
        <WeatherParameter
          icon={<AirIcon />}
          value={`${Math.round(data.windSpeed)} km/h`}
          barColor={getBarColorForWindSpeed(data.windSpeed)}
        />
        <WeatherParameter
          icon={<LightModeIcon />}
          value={`UVI ${Math.round(data.uvi)}`}
          barColor={getBarColorForUltraViolet(Math.round(data.uvi))}
        />
        <WeatherParameter
          icon={<BiotechIcon />}
          value={data.aqi === 0 ? 'AQI ??' : `AQI ${Math.round(data.aqi)}`}
          barColor={getBarColorForAirQuality(Math.round(data.aqi))}
        />
      </div>
    </div>
  </div>
)

export default CurrentWeather
