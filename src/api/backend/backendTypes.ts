import { WeatherServiceData } from './weatherTypes'

export type StatusColor = 'none' | 'red' | 'yellow' | 'green' | 'blue'

export type Status = {
  color: StatusColor
  message: string
  enabled?: boolean
}

export type ServiceStatus = {
  status: Status
  helpers: {
    [name: string]: Status
  }
}

export type ServiceManagerStatus = {
  startTime: number
  daysRunning: number
  services: {
    [name: string]: ServiceStatus
  }
}

export interface ServiceDataObject {
  weather: WeatherServiceData
}
