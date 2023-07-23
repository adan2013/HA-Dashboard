import { ReactElement } from 'react'
import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined'
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SettingsRemoteOutlinedIcon from '@mui/icons-material/SettingsRemoteOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

type PageMetadata = {
  path: string
  title?: string
}

type MenuItem = {
  name: string
  path: string
  icon: ReactElement
  notificationDot?: boolean
}

type MenuTile = {
  name: string
  path: string
  background: string
  iconColor: string
  icon: ReactElement
  iconClass?: string
}

export const pageMetadata: PageMetadata[] = [
  { path: '/', title: 'Dashboard' },
  { path: '/weather', title: 'Weather' },
  { path: '/notifications', title: 'Notifications' },
  { path: '/customization', title: 'Customization' },
  { path: '/section/lights', title: 'Lights' },
  { path: '/section/temperatures', title: 'Temperatures' },
  { path: '/section/automations', title: 'Automations' },
  { path: '/section/alerts', title: 'Alerts' },
  { path: '/section/system', title: 'System' },
  { path: '/section/remote-control', title: 'Remote control' }
]

export const mobileMenu: MenuItem[] = [
  { name: 'Dashboard', path: '/', icon: <GridViewOutlinedIcon /> },
  { name: 'Weather', path: '/weather', icon: <WbSunnyOutlinedIcon /> },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: <NotificationsNoneOutlinedIcon />,
    notificationDot: true
  },
  {
    name: 'More',
    path: '/customization',
    icon: <MoreHorizOutlinedIcon />
  }
]

export const sectionTiles: MenuTile[] = [
  {
    name: 'Lights',
    path: '/section/lights',
    background: 'bg-blue-500',
    iconColor: 'text-blue-300',
    icon: <LightOutlinedIcon />
  },
  {
    name: 'Temperatures',
    path: '/section/temperatures',
    background: 'bg-red-500',
    iconColor: 'text-red-300',
    icon: <DeviceThermostatOutlinedIcon />
  },
  {
    name: 'Automations',
    path: '/section/automations',
    background: 'bg-yellow-500',
    iconColor: 'text-yellow-300',
    icon: <MemoryOutlinedIcon />
  },
  {
    name: 'Alerts',
    path: '/section/alerts',
    background: 'bg-green-500',
    iconColor: 'text-green-300',
    icon: <ForumOutlinedIcon />
  },
  {
    name: 'System',
    path: '/section/system',
    background: 'bg-gray-500',
    iconColor: 'text-gray-300',
    icon: <SettingsOutlinedIcon />
  },
  {
    name: 'Remote control',
    path: '/section/remote-control',
    background: 'bg-orange-500',
    iconColor: 'text-orange-300',
    icon: <SettingsRemoteOutlinedIcon />,
    iconClass: 'rotate-[35deg]'
  }
]
