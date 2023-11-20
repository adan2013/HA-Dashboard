import Tile from '../../basic/Tile'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

type Props = {
  value: number
}

const WindGustTile = ({ value }: Props) => (
  <Tile
    title="Wind gust"
    customBody={
      value ? (
        <RangeSegmentChart
          value={Math.round(value)}
          label="km/h"
          thresholds={[20, 40, 60, 80]}
        />
      ) : (
        <div className="relative h-32">
          <div className="absolute bottom-10 right-1/2 translate-x-1/2 text-4xl">
            --
          </div>
          <div className="absolute bottom-0 right-1/2 translate-x-1/2">
            No data
          </div>
        </div>
      )
    }
  />
)

export default WindGustTile
