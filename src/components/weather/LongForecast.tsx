import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { WeatherServiceData } from '../../api/backend/weatherTypes'
import { addLeadingZero } from '../../utils/numberUtils'
import { getDayOfWeekName } from './utils'

type LongForecastProps = {
  data: Pick<WeatherServiceData, 'longForecast'>
}

const LongForecast = ({ data }: LongForecastProps) => (
  <div className="m-1 flex flex-col gap-2 text-center text-lg">
    {data.longForecast.map(f => {
      const time = new Date(f.timestamp)
      return (
        <div className="flex flex-row items-center gap-1" key={f.timestamp}>
          <div className="w-20 text-right">{`${getDayOfWeekName(
            time
          )} ${addLeadingZero(time.getDate())}`}</div>
          <div className="px-2">
            <img
              src={`https://openweathermap.org/img/wn/${f.weather.icon}.png`}
              alt={f.weather.type}
            />
          </div>
          <div className="w-20 text-left">{`${Math.round(
            f.dayTemp
          )}° / ${Math.round(f.nightTemp)}°`}</div>
          <div className="flex-1">
            <WaterDropIcon className="mr-1" />
            {Math.round(f.pop)}%
            <AirIcon className="ml-4 mr-1" />
            {Math.round(f.windSpeed)} km/h
          </div>
        </div>
      )
    })}
  </div>
)

export default LongForecast
