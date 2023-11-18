import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Tile from '../../basic/Tile'

type Props = {
  windDirection: number
}

const WindDirectionTile = ({ windDirection }: Props) => (
  <Tile
    title="Wind Direction"
    customBody={
      <div className="relative mt-4 flex items-center justify-center">
        <div className="absolute top-0 z-10 h-6 w-6 translate-y-[-40%] bg-blue-900 text-center">
          N
        </div>
        <div
          className="rounded-full border-2 border-white p-4"
          style={{
            transform: `rotate(${windDirection}deg)`
          }}
        >
          <ArrowUpwardIcon className="!text-7xl" />
        </div>
      </div>
    }
  />
)

export default WindDirectionTile
