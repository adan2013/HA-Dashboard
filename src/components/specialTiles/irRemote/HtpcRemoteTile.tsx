import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import ZoomOutMapOutlinedIcon from '@mui/icons-material/ZoomOutMapOutlined'
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined'
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined'
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import IrRemoteTile, { IrRemoteItem } from './IrRemoteTile'
import { htpcCodes as codes } from './irRemoteCodes'

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
      {
        id: 'reload',
        label: 'Reload',
        code: codes.reload,
        content: <AutorenewOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-2 row-start-2',
    buttons: [
      {
        id: 'apps',
        label: 'Apps',
        code: codes.apps,
        content: <AppsOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-1 row-start-3',
    buttons: [
      {
        id: 'fullscreen',
        label: 'Fullscreen',
        code: codes.fullscreen,
        content: <ZoomOutMapOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-2 row-start-3',
    buttons: [
      {
        id: 'enter',
        label: 'Enter',
        code: codes.enter,
        content: <KeyboardReturnOutlinedIcon />,
        sub: 'OK'
      }
    ]
  },
  {
    placement: 'col-start-3 row-span-2 row-start-2',
    direction: 'col',
    buttons: [
      {
        id: 'vol_up',
        label: 'Volume up',
        code: codes.vol_up,
        content: <VolumeUpOutlinedIcon />,
        sub: '▲'
      },
      {
        id: 'vol_down',
        label: 'Volume down',
        code: codes.vol_down,
        content: <VolumeDownOutlinedIcon />,
        sub: '▼'
      }
    ]
  }
]

type HtpcRemoteTileProps = {
  title: string
}

const HtpcRemoteTile = ({ title }: HtpcRemoteTileProps) => (
  <IrRemoteTile
    title={title}
    gridClassName="grid-cols-3 grid-rows-3"
    items={items}
  />
)

export default HtpcRemoteTile
