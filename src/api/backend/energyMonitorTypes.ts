export type EnergyStatistics = {
  total: number
  monthly: number
  daily: number
  runtime: number
}

export type InitialEnergyStatistics = {
  inThisMonth: number
  inThisDay: number
  inThisRuntime: number
}

export type DeviceStatistics = {
  deviceName: string
  consumedEnergy: EnergyStatistics
  initialValues: InitialEnergyStatistics
}

export type EnergyMonitorServiceData = {
  monitors: DeviceStatistics[]
}
