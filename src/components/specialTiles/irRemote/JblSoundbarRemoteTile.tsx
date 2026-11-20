import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import BluetoothOutlinedIcon from '@mui/icons-material/BluetoothOutlined'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined'
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import IrRemoteTile, { IrRemoteItem } from './IrRemoteTile'
import { jblSoundbarCodes as codes } from './irRemoteCodes'

const items: IrRemoteItem[] = [
  {
    placement: 'col-start-1 row-start-1',
    buttons: [
      {
        id: 'power',
        label: 'Power',
        code: codes.power,
        content: <PowerSettingsNewOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-3 row-start-1',
    buttons: [
      {
        id: 'vol_mute',
        label: 'Mute',
        code: codes.vol_mute,
        content: <VolumeOffOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-1 row-start-2',
    buttons: [
      { id: 'input_tv', label: 'TV input', code: codes.input_tv, content: 'TV' }
    ]
  },
  {
    placement: 'col-start-2 row-start-2',
    buttons: [
      {
        id: 'play',
        label: 'Play',
        code: codes.play,
        content: <PlayArrowOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-1 row-start-3',
    buttons: [
      {
        id: 'input_bt',
        label: 'Bluetooth input',
        code: codes.input_bt,
        content: <BluetoothOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-2 row-start-3',
    buttons: [{ id: 'bass', label: 'Bass', code: codes.bass, content: 'BASS' }]
  },
  {
    placement: 'col-start-3 row-span-2 row-start-2',
    direction: 'col',
    buttons: [
      {
        id: 'vol_up',
        label: 'Volume up',
        code: codes.vol_up,
        content: <VolumeUpOutlinedIcon />
      },
      {
        id: 'vol_down',
        label: 'Volume down',
        code: codes.vol_down,
        content: <VolumeDownOutlinedIcon />
      }
    ]
  }
]

type JblSoundbarRemoteTileProps = {
  title: string
}

const JblSoundbarRemoteTile = ({ title }: JblSoundbarRemoteTileProps) => (
  <IrRemoteTile
    title={title}
    gridClassName="grid-cols-3 grid-rows-3"
    items={items}
  />
)

export default JblSoundbarRemoteTile
