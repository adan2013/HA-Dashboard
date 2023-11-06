import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { cloneElement, ReactElement } from 'react'
import LightModeIcon from '@mui/icons-material/LightMode'
import BiotechIcon from '@mui/icons-material/Biotech'
import { CurrentWeather as CurrentWeatherType } from '../../../api/backend/weatherTypes'

type WeatherParameterProps = {
  icon: ReactElement
  value: number | string
}

const WeatherParameter = ({ icon, value }: WeatherParameterProps) => (
  <div className="flex w-20 flex-col items-center gap-1">
    <div className="flex items-center gap-1">
      {cloneElement(icon, { className: '!text-[2rem]' })}
    </div>
    <div className="text-lg">{value}</div>
  </div>
)

type CurrentWeatherProps = {
  data: CurrentWeatherType
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => (
  <div className="flex flex-row items-center gap-3 overflow-x-auto text-lg">
    <div className="min-w-[60px]">
      <img
        src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
        alt={data.weather.type}
      />
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="text-6xl">{Math.round(data.temp)}°</div>
      <div className="text-lg text-gray-200">
        Feels like {Math.round(data.feelsLike)}°
      </div>
    </div>
    <div className="flex-1">
      <div className="flex flex-row justify-end gap-1">
        <WeatherParameter
          icon={<WaterDropIcon />}
          value={`${Math.round(data.humidity)}%`}
        />
        <WeatherParameter
          icon={<AirIcon />}
          value={`${Math.round(data.windSpeed)} km/h`}
        />
        <WeatherParameter
          icon={<LightModeIcon />}
          value={`UVI ${Math.round(data.uvi)}`}
        />
        <WeatherParameter
          icon={<BiotechIcon />}
          value={`AQI ${Math.round(data.aqi)}`}
        />
      </div>
    </div>
  </div>
)

export default CurrentWeather
