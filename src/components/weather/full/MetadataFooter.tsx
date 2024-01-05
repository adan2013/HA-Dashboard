import { WeatherServiceData } from '../../../api/backend/weatherTypes'

type Props = {
  state: WeatherServiceData
}

const MetadataFooter = ({ state }: Props) => (
  <div className="py-4 text-center font-light text-gray-300">
    <div>{`Last update at: ${new Date(state.timestamp).toLocaleString()}`}</div>
    <div>{`Air quality index provided by ${state.aqiStationName}`}</div>
    <div>{`Station ID: ${state.aqiStationId} | Station time: ${new Date(
      state.aqiStationTime
    ).toLocaleString()}`}</div>
  </div>
)

export default MetadataFooter
