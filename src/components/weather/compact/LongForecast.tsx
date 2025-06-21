import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { LongForecast as LongForecastType } from '../../../api/backend/weatherTypes'
import { addLeadingZero } from '../../../utils/numberUtils'
import { getDayOfWeekName, removePastDays } from '../utils'

type LongForecastProps = {
  data: LongForecastType[]
}

const LongForecast = ({ data }: LongForecastProps) => (
  <div className="m-1 flex flex-col gap-2 text-center">
    {removePastDays(data).map(f => {
      const time = new Date(f.timestamp)
      return (
        <div
          className="flex flex-col items-center justify-between gap-2 rounded bg-gray-800 px-3 py-2 sm:flex-row"
          key={f.timestamp}
        >
          <div className="flex flex-row items-center gap-1">
            <div className="w-20 text-right">{`${getDayOfWeekName(
              time
            )} ${addLeadingZero(time.getDate())}`}</div>
            <img
              src={`https://openweathermap.org/img/wn/${f.weather.icon}.png`}
              alt={f.weather.type}
              className="my-[-8px]"
            />
            <div className="">{`${Math.round(f.dayTemp)}° / ${Math.round(
              f.nightTemp
            )}°`}</div>
          </div>
          <div className="flex flex-1 flex-row justify-center gap-1">
            <WaterDropIcon />
            {Math.round(f.pop)}%
            <AirIcon className="ml-4" />
            {Math.round(f.windSpeed)} km/h
          </div>
        </div>
      )
    })}
  </div>
)

export default LongForecast
