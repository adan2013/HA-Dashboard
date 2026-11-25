import { WeatherServiceData } from './weatherTypes'
import { NotificationsServiceData } from './notificationTypes'
import { EnergyMonitorServiceData } from './energyMonitorTypes'

export type StatusColor = 'none' | 'red' | 'yellow' | 'green' | 'blue'

export type Status = {
  color: StatusColor
  message: string
}

export type ValueHelperStatus = Status & {
  value: number | string | null
  updatedAt: string | null
  error: string | null
}

export type HelperStatus = Status | ValueHelperStatus

export type ServiceStatus = {
  status: Status
  helpers: {
    [name: string]: HelperStatus
  }
}

export type ServiceManagerStatus = {
  currentTime: string
  startTime: string
  daysRunning: number
  syncedEntitiesCount: number
  services: {
    [name: string]: ServiceStatus
  }
}

export interface ServiceDataObject {
  weather: WeatherServiceData
  notifications: NotificationsServiceData
  energyMonitor: EnergyMonitorServiceData
}
