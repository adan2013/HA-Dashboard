import Tile from '../../basic/Tile'
import { addLeadingZero } from '../../../utils/numberUtils'

type Props = {
  sunrise: number
  sunset: number
}

const formatTime = (date: Date) =>
  `${date.getHours()}:${addLeadingZero(date.getMinutes())}`

const SunTile = ({ sunrise, sunset }: Props) => {
  if (!sunrise || !sunset) return null
  const now = new Date()
  const sunriseDate = new Date(sunrise)
  const sunsetDate = new Date(sunset)
  const lengthOfPhase = sunsetDate.getTime() - sunriseDate.getTime()
  if (lengthOfPhase <= 0) return null
  const percentageOfPhaseLeft = Math.max(
    Math.round(((sunsetDate.getTime() - now.getTime()) / lengthOfPhase) * 100),
    0
  )

  return (
    <Tile
      title="Sun position"
      customBody={
        <>
          <div className="mx-2 mb-2 mt-4 h-20 overflow-hidden">
            <div className="relative aspect-square overflow-hidden rounded-full bg-gray-800">
              <div
                className="absolute h-full w-full bg-amber-500"
                style={{
                  right: `${percentageOfPhaseLeft}%`
                }}
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-2">{formatTime(sunriseDate)}</div>
            <div className="absolute right-2">{formatTime(sunsetDate)}</div>
          </div>
        </>
      }
    />
  )
}

export default SunTile
