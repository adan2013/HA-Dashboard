import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import CallServiceTile from '../entityTiles/services/CallServiceTile'

const SpeakerTestTile = () => (
  <CallServiceTile
    title="Test speaker"
    domain="esphome"
    service="dash_node_play_rtttl"
    payload={{
      song_str: 'two_short:d=4,o=5,b=100:16e6,16e6'
    }}
    icon={<VolumeUpIcon />}
  />
)

export default SpeakerTestTile
