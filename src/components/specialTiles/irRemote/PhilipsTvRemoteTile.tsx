import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import InputOutlinedIcon from '@mui/icons-material/InputOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined'
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import IrRemoteTile, { IrRemoteItem } from './IrRemoteTile'
import { philipsTvCodes as codes } from './irRemoteCodes'

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
    placement: 'col-start-4 row-start-1',
    buttons: [
      {
        id: 'dpad_up',
        label: 'Up',
        code: codes.dpad_up,
        content: <KeyboardArrowUpOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-7 row-start-1',
    buttons: [
      {
        id: 'input',
        label: 'Input',
        code: codes.input,
        content: <InputOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-3 row-start-2',
    buttons: [
      {
        id: 'dpad_left',
        label: 'Left',
        code: codes.dpad_left,
        content: <KeyboardArrowLeftOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-4 row-start-2',
    buttons: [
      { id: 'dpad_ok', label: 'OK', code: codes.dpad_ok, content: 'OK' }
    ]
  },
  {
    placement: 'col-start-5 row-start-2',
    buttons: [
      {
        id: 'dpad_right',
        label: 'Right',
        code: codes.dpad_right,
        content: <KeyboardArrowRightOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-1 row-start-3',
    buttons: [
      {
        id: 'back',
        label: 'Back',
        code: codes.back,
        content: <ArrowBackOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-4 row-start-3',
    buttons: [
      {
        id: 'dpad_down',
        label: 'Down',
        code: codes.dpad_down,
        content: <KeyboardArrowDownOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-7 row-start-3',
    buttons: [
      {
        id: 'home',
        label: 'Home',
        code: codes.home,
        content: <HomeOutlinedIcon />
      }
    ]
  },
  {
    placement: 'col-start-1 row-start-4',
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
    placement: 'col-span-6 col-start-2 row-start-4',
    buttons: [
      {
        id: 'vol_down',
        label: 'Volume down',
        code: codes.vol_down,
        content: <VolumeDownOutlinedIcon />
      },
      {
        id: 'vol_up',
        label: 'Volume up',
        code: codes.vol_up,
        content: <VolumeUpOutlinedIcon />
      }
    ]
  }
]

type PhilipsTvRemoteTileProps = {
  title: string
}

const PhilipsTvRemoteTile = ({ title }: PhilipsTvRemoteTileProps) => (
  <IrRemoteTile
    title={title}
    gridClassName="grid-cols-[1fr_0.25rem_repeat(3,3.25rem)_0.25rem_1fr] grid-rows-[repeat(4,3.25rem)] content-end"
    items={items}
  />
)

export default PhilipsTvRemoteTile
