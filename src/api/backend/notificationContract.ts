// Shared wire contract. Keep this file identical in HA-Backend and HA-Dashboard.
// Payload is optional for notifications triggered manually without sensor data.
export type OfflineReason = 'unavailable' | 'unknown' | 'pingFailed'

export type NotificationPayloadMap = {
  test1: undefined
  test2: undefined
  test3: undefined
  backendStarted: undefined
  loadedWashingMachine: undefined
  '3dPrintFinished': { autoOffEnabled: boolean }
  '3dPrintPaused': undefined
  '3dPrintFailed': undefined
  '3dPrintStatus': {
    phase: 'preparing' | 'printing'
    progressPercentage: number | null
    currentLayer: number | null
    totalLayerCount: number | null
    remainingMinutes: number | null
    autoOffEnabled: boolean
  }
  deadlineWarning: {
    deadlines: {
      label: string
      // Positive: days remaining; zero: due today; negative: days overdue.
      daysLeft: number
    }[]
  }
  mainDoorOpen: undefined
  mainDoorOpenAlert: undefined
  waterLeak: { sensors: string[] }
  smsFailure: {
    source: 'waterLeak' | 'mainDoorOpen' | 'test'
    errors: string[]
    delivery?: { sent: number; total: number }
  }
  lowBattery: { devices: { name: string; batteryPercentage: number | null }[] }
  offlineSensor: { devices: { name: string; reason: OfflineReason }[] }
  noSensorUpdate: { devices: { name: string; hoursSinceLastReport: number | null }[] }
  manualKitchenLights: undefined
  broadcastDeviceCamera: { devices: string[] }
  broadcastDeviceMicrophone: { devices: string[] }
}

export type NotificationId = keyof NotificationPayloadMap

// Mapping each ID separately preserves the relationship when narrowing by ID.
export type NotificationDetails = {
  [Id in NotificationId]: { id: Id; payload?: NotificationPayloadMap[Id] }
}[NotificationId]

export type NotificationLight =
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'redFlashing'
  | 'blueFlashing'

export type NotificationIconName =
  | 'ScienceOutlined'
  | 'RestartAlt'
  | 'LocalLaundryServiceOutlined'
  | 'CheckCircleOutline'
  | 'PauseCircleOutline'
  | 'ErrorOutline'
  | 'ViewInArOutlined'
  | 'EventOutlined'
  | 'MeetingRoomOutlined'
  | 'NotificationImportantOutlined'
  | 'WaterDropOutlined'
  | 'SmsFailedOutlined'
  | 'BatteryAlertOutlined'
  | 'WifiOffOutlined'
  | 'SensorsOffOutlined'
  | 'LightbulbOutlined'
  | 'VideocamOutlined'
  | 'MicOutlined'

export type NotificationPayload = NotificationDetails & {
  title: string
  // Optional on the wire so dashboards can also render older backend messages.
  icon?: NotificationIconName
  priorityOrder: 'low' | 'medium' | 'high'
  light?: NotificationLight
  canBeDismissed?: boolean
  ignoreDND?: boolean
  createdAt: string
}
