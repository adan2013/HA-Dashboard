import Tile from '../../basic/Tile'
import { CurrentWeather } from '../../../api/backend/weatherTypes'

type Props = {
  current: CurrentWeather
}

const CurrentWeatherTile = ({ current }: Props) => (
  <Tile
    title="Current"
    size="horizontal"
    customBody={
      <div className="grid h-32 grid-cols-2 items-center text-lg">
        <div className="flex justify-center">
          <img
            src={`https://openweathermap.org/img/wn/${current.weather.icon}@2x.png`}
            alt={current.weather.type}
          />
        </div>
        <div className="flex min-w-[100px] flex-col items-start gap-1">
          <div className="text-5xl">{Math.round(current.temp)}°</div>
          <div className="text-lg">
            Feels like {Math.round(current.feelsLike)}°
          </div>
          <div className="text-gray-200">{current.weather.type}</div>
        </div>
      </div>
    }
  />
)

export default CurrentWeatherTile
