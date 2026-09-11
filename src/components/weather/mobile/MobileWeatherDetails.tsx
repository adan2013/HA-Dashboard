import { ReactNode } from 'react'
import { WeatherServiceData } from '../../../api/backend/weatherTypes'
import CurrentWeather from '../compact/CurrentWeather'
import ShortForecast from '../compact/ShortForecast'
import LongForecast from '../compact/LongForecast'
import AqIndexHistoryTile from '../full/AqIndexHistoryTile'
import DewPointTile from '../full/DewPointTile'
import HumidityTile from '../full/HumidityTile'
import MetadataFooter from '../full/MetadataFooter'
import PressureTile from '../full/PressureTile'
import RainRadarTile from '../full/RainRadarTile'
import SunTile from '../full/SunTile'
import TemperatureHistoryTile from '../full/TemperatureHistoryTile'
import UvIndexHistoryTile from '../full/UvIndexHistoryTile'
import VisibilityTile from '../full/VisibilityTile'
import WindDirectionTile from '../full/WindDirectionTile'
import WindGustTile from '../full/WindGustTile'
import WindHistoryTile from './WindHistoryTile'

type Props = {
  state: WeatherServiceData
}

type SectionProps = {
  title: string
  children: ReactNode
}

const WeatherSection = ({ title, children }: SectionProps) => (
  <section aria-labelledby={`mobile-weather-${title.replaceAll(' ', '-')}`}>
    <h2
      id={`mobile-weather-${title.replaceAll(' ', '-')}`}
      className="mb-3 text-xl font-bold"
    >
      {title}
    </h2>
    {children}
  </section>
)

const Divider = () => <div className="mx-1 border-b border-gray-400" />

const MobileWeatherDetails = ({ state }: Props) => (
  <div
    className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    data-testid="mobile-weather-details"
  >
    <div className="flex flex-col gap-2">
      <CurrentWeather
        data={state.current}
        shortForecast={state.shortForecast}
      />
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

    <WeatherSection title="Additional details">
      <div className="grid grid-cols-2 gap-3">
        <TemperatureHistoryTile history={state.historicalWeather.temp} />
        <WindHistoryTile history={state.historicalWeather.windSpeed} />
        <HumidityTile value={state.current.humidity} />
        <VisibilityTile value={state.current.visibility} />
        <WindDirectionTile windDirection={state.current.windDeg} />
        <WindGustTile value={state.current.windGust} />
        <DewPointTile value={state.current.dewPoint} />
        <SunTile
          sunrise={state.current.sunrise}
          sunset={state.current.sunset}
        />
        <PressureTile
          current={state.current.pressure}
          history={state.historicalWeather.pressure}
        />
        <UvIndexHistoryTile history={state.historicalWeather.uvi} />
        <AqIndexHistoryTile history={state.historicalWeather.aqi} />
        <RainRadarTile openModalOnClick />
      </div>
    </WeatherSection>

    <MetadataFooter state={state} />
  </div>
)

export default MobileWeatherDetails
