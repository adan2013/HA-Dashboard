import ScienceOutlined from '@mui/icons-material/ScienceOutlined'
import RestartAlt from '@mui/icons-material/RestartAlt'
import LocalLaundryServiceOutlined from '@mui/icons-material/LocalLaundryServiceOutlined'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import ViewInArOutlined from '@mui/icons-material/ViewInArOutlined'
import EventOutlined from '@mui/icons-material/EventOutlined'
import MeetingRoomOutlined from '@mui/icons-material/MeetingRoomOutlined'
import NotificationImportantOutlined from '@mui/icons-material/NotificationImportantOutlined'
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined'
import SmsFailedOutlined from '@mui/icons-material/SmsFailedOutlined'
import BatteryAlertOutlined from '@mui/icons-material/BatteryAlertOutlined'
import WifiOffOutlined from '@mui/icons-material/WifiOffOutlined'
import SensorsOffOutlined from '@mui/icons-material/SensorsOffOutlined'
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined'
import VideocamOutlined from '@mui/icons-material/VideocamOutlined'
import MicOutlined from '@mui/icons-material/MicOutlined'
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined'
import { NotificationIconName } from '../../api/backend/notificationContract'

export const notificationIcons = {
  ScienceOutlined,
  RestartAlt,
  LocalLaundryServiceOutlined,
  CheckCircleOutline,
  PauseCircleOutline,
  ErrorOutline,
  ViewInArOutlined,
  EventOutlined,
  MeetingRoomOutlined,
  NotificationImportantOutlined,
  WaterDropOutlined,
  SmsFailedOutlined,
  BatteryAlertOutlined,
  WifiOffOutlined,
  SensorsOffOutlined,
  LightbulbOutlined,
  VideocamOutlined,
  MicOutlined
} satisfies Record<NotificationIconName, typeof NotificationsNoneOutlined>

const NotificationIcon = ({ name }: { name?: NotificationIconName }) => {
  const Icon = Object.hasOwn(notificationIcons, name)
    ? notificationIcons[name]
    : NotificationsNoneOutlined
  return <Icon className="shrink-0 text-gray-300" />
}

export default NotificationIcon
