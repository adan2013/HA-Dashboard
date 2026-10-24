import {
  NotificationId,
  NotificationPayload
} from '../../api/backend/notificationContract'

// Presentation metadata copied from HA-Backend/src/configs/notification.config.ts.
// Keep titles, icons, lights and dismissibility in sync; only payloads are simulated.
// Exhaustive mapping makes a new notification ID require a preview fixture.
type NotificationExamples = {
  [Id in NotificationId]: Extract<NotificationPayload, { id: Id }>
}

const notificationExamples: NotificationExamples = {
  test1: {
    id: 'test1',
    icon: 'ScienceOutlined',
    title: 'Test notification',
    priorityOrder: 'high',
    light: 'red',
    canBeDismissed: true,
    createdAt: '2026-10-24T12:30:00Z'
  },
  test2: {
    id: 'test2',
    icon: 'ScienceOutlined',
    title: 'Test notification',
    priorityOrder: 'medium',
    light: 'yellow',
    canBeDismissed: true,
    ignoreDND: true,
    createdAt: '2026-10-24T12:30:00Z'
  },
  test3: {
    id: 'test3',
    icon: 'ScienceOutlined',
    title: 'Test notification',
    canBeDismissed: false,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z'
  },
  backendStarted: {
    id: 'backendStarted',
    icon: 'RestartAlt',
    title: 'System restarted',
    priorityOrder: 'high',
    light: 'purple',
    canBeDismissed: true,
    createdAt: '2026-10-24T12:30:00Z'
  },
  loadedWashingMachine: {
    id: 'loadedWashingMachine',
    icon: 'LocalLaundryServiceOutlined',
    title: 'Laundry is ready',
    light: 'green',
    ignoreDND: true,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z'
  },
  '3dPrintFinished': {
    id: '3dPrintFinished',
    icon: 'CheckCircleOutline',
    title: '3D print finished',
    canBeDismissed: true,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      autoOffEnabled: true
    }
  },
  '3dPrintPaused': {
    id: '3dPrintPaused',
    icon: 'PauseCircleOutline',
    title: '3D print paused',
    canBeDismissed: true,
    light: 'blueFlashing',
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z'
  },
  '3dPrintFailed': {
    id: '3dPrintFailed',
    icon: 'ErrorOutline',
    title: '3D print failed',
    canBeDismissed: true,
    light: 'red',
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z'
  },
  '3dPrintStatus': {
    id: '3dPrintStatus',
    icon: 'ViewInArOutlined',
    title: '3D printer',
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      phase: 'printing',
      progressPercentage: 64,
      currentLayer: 192,
      totalLayerCount: 300,
      remainingMinutes: 87,
      autoOffEnabled: true
    }
  },
  deadlineWarning: {
    id: 'deadlineWarning',
    icon: 'EventOutlined',
    title: 'Upcoming deadline',
    canBeDismissed: true,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      deadlines: [
        { label: 'water prefilters', daysLeft: 5 },
        { label: 'coffee machine cleaning', daysLeft: 0 },
        { label: 'car insurance', daysLeft: -3 }
      ]
    }
  },
  mainDoorOpen: {
    id: 'mainDoorOpen',
    icon: 'MeetingRoomOutlined',
    title: 'The main door is open',
    priorityOrder: 'medium',
    light: 'yellow',
    ignoreDND: true,
    createdAt: '2026-10-24T12:30:00Z'
  },
  mainDoorOpenAlert: {
    id: 'mainDoorOpenAlert',
    icon: 'NotificationImportantOutlined',
    title: 'Main door open too long',
    priorityOrder: 'medium',
    light: 'red',
    ignoreDND: true,
    createdAt: '2026-10-24T12:30:00Z'
  },
  waterLeak: {
    id: 'waterLeak',
    icon: 'WaterDropOutlined',
    title: 'Water leak detected',
    priorityOrder: 'high',
    light: 'redFlashing',
    ignoreDND: true,
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      sensors: ['Kitchen sink', 'Bathroom washing machine']
    }
  },
  smsFailure: {
    id: 'smsFailure',
    icon: 'SmsFailedOutlined',
    title: 'SMS alert failed',
    light: 'red',
    canBeDismissed: true,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      source: 'waterLeak',
      errors: ['SMS provider request timed out'],
      delivery: {
        sent: 1,
        total: 2
      }
    }
  },
  lowBattery: {
    id: 'lowBattery',
    icon: 'BatteryAlertOutlined',
    title: 'Low battery detected',
    priorityOrder: 'low',
    canBeDismissed: true,
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      devices: [
        { name: 'Bedroom temperature sensor', batteryPercentage: 24 },
        { name: 'Main door sensor', batteryPercentage: 8 }
      ]
    }
  },
  offlineSensor: {
    id: 'offlineSensor',
    icon: 'WifiOffOutlined',
    title: 'Sensor is offline',
    priorityOrder: 'low',
    canBeDismissed: true,
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      devices: [
        { name: 'DashNode', reason: 'pingFailed' },
        { name: 'Garage motion sensor', reason: 'unavailable' }
      ]
    }
  },
  noSensorUpdate: {
    id: 'noSensorUpdate',
    icon: 'SensorsOffOutlined',
    title: 'Sensor is not reporting',
    priorityOrder: 'low',
    canBeDismissed: true,
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      devices: [{ name: 'Garden temperature sensor', hoursSinceLastReport: 38 }]
    }
  },
  manualKitchenLights: {
    id: 'manualKitchenLights',
    icon: 'LightbulbOutlined',
    title: 'Kitchen lights in manual mode',
    priorityOrder: 'low',
    canBeDismissed: true,
    createdAt: '2026-10-24T12:30:00Z'
  },
  broadcastDeviceCamera: {
    id: 'broadcastDeviceCamera',
    icon: 'VideocamOutlined',
    title: 'Camera is in use',
    light: 'green',
    ignoreDND: true,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      devices: ['Office laptop']
    }
  },
  broadcastDeviceMicrophone: {
    id: 'broadcastDeviceMicrophone',
    icon: 'MicOutlined',
    title: 'Microphone is in use',
    light: 'yellow',
    ignoreDND: true,
    priorityOrder: 'low',
    createdAt: '2026-10-24T12:30:00Z',
    payload: {
      devices: ['Office laptop', 'Living room tablet']
    }
  }
}

export default notificationExamples
