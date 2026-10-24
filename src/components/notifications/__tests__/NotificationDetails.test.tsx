import { render, screen, within } from '@testing-library/react'
import NotificationDetails from '../NotificationDetails'
import {
  NotificationDetails as Details,
  NotificationPayload,
  NotificationPayloadMap
} from '../../../api/backend/notificationContract'

const notification = (details: Details): NotificationPayload => ({
  ...details,
  title: 'Notification',
  description: '',
  priorityOrder: 'low',
  createdAt: '2026-10-24T12:00:00Z'
})

const printPayload: NotificationPayloadMap['3dPrintStatus'] = {
  phase: 'printing',
  progressPercentage: 42,
  currentLayer: 84,
  totalLayerCount: 200,
  remainingMinutes: 64,
  autoOffEnabled: true
}

const renderDetails = (details: Details) =>
  render(<NotificationDetails notification={notification(details)} />)

describe('NotificationDetails', () => {
  it('renders deadlines as separate bullet points, preserving commas inside names', () => {
    renderDetails({
      id: 'deadlineWarning',
      payload: { deadlines: ['Filter, kitchen', 'Water plants'] }
    })
    expect(
      screen.getByRole('region', { name: 'Detected deadlines' })
    ).toBeVisible()
    expect(screen.queryByText('Upcoming deadlines')).not.toBeInTheDocument()
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Filter, kitchen')
    expect(items[1]).toHaveTextContent('Water plants')
  })

  it.each([
    'lowBattery',
    'offlineSensor',
    'noSensorUpdate',
    'broadcastDeviceCamera',
    'broadcastDeviceMicrophone'
  ] as const)('renders devices for %s', id => {
    renderDetails({
      id,
      payload: { devices: ['Kitchen sensor', 'Bathroom sensor'] }
    })
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Kitchen sensor')).toBeVisible()
    expect(screen.getByText('Bathroom sensor')).toBeVisible()
  })

  it('renders leak locations', () => {
    renderDetails({ id: 'waterLeak', payload: { sensors: ['Under sink'] } })
    expect(
      screen.getByRole('region', { name: 'Triggered sensors' })
    ).toBeVisible()
    expect(screen.getByRole('listitem')).toHaveTextContent('Under sink')
  })

  it('renders print progress, layers, remaining time and auto off', () => {
    renderDetails({ id: '3dPrintStatus', payload: printPayload })
    expect(
      screen.getByRole('progressbar', { name: 'Print completion' })
    ).toHaveAttribute('aria-valuenow', '42')
    expect(screen.getByText('42%')).toBeVisible()
    expect(screen.getByText('84 / 200')).toBeVisible()
    expect(screen.getByText('1h 4m')).toBeVisible()
    expect(screen.getByText('Auto off enabled')).toBeVisible()
  })

  it('refreshes progress and auto off when new service data arrives', () => {
    const { rerender } = renderDetails({
      id: '3dPrintStatus',
      payload: printPayload
    })
    rerender(
      <NotificationDetails
        notification={notification({
          id: '3dPrintStatus',
          payload: {
            ...printPayload,
            progressPercentage: 75,
            currentLayer: 150,
            remainingMinutes: 25,
            autoOffEnabled: false
          }
        })}
      />
    )
    expect(
      screen.getByRole('progressbar', { name: 'Print completion' })
    ).toHaveAttribute('aria-valuenow', '75')
    expect(screen.getByText('150 / 200')).toBeVisible()
    expect(screen.getByText('25m')).toBeVisible()
    expect(screen.queryByText(/Auto off/)).not.toBeInTheDocument()
    expect(screen.queryByTestId('PowerSettingsNewIcon')).not.toBeInTheDocument()
  })

  it('handles unavailable sensor data without displaying NaN or fake progress', () => {
    renderDetails({
      id: '3dPrintStatus',
      payload: {
        ...printPayload,
        phase: 'preparing',
        progressPercentage: null,
        currentLayer: null,
        totalLayerCount: null,
        remainingMinutes: null
      }
    })
    expect(screen.getByText('Preparing to print…')).toBeVisible()
    expect(screen.getByText('— / —')).toBeVisible()
    expect(screen.getByText('Estimating…')).toBeVisible()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('shows auto off on finished prints when enabled', () => {
    renderDetails({ id: '3dPrintFinished', payload: { autoOffEnabled: true } })
    expect(screen.getByText('Auto off enabled')).toBeVisible()
  })

  it('renders no details or spacing on finished prints when auto off is disabled', () => {
    const { container } = renderDetails({
      id: '3dPrintFinished',
      payload: { autoOffEnabled: false }
    })
    expect(container).toBeEmptyDOMElement()
  })

  it('separates SMS source and failure reason', () => {
    renderDetails({
      id: 'smsFailure',
      payload: {
        source: 'waterLeak',
        errors: ['Sendly HTTP 503'],
        delivery: { sent: 1, total: 2 }
      }
    })
    expect(
      screen.getByRole('region', { name: 'SMS delivery failure' })
    ).toBeVisible()
    expect(screen.getByText('Water leak')).toBeVisible()
    expect(screen.getByText('Sendly HTTP 503')).toBeVisible()
    expect(screen.getByText('1 / 2')).toBeVisible()
  })

  it('omits empty lists and missing payloads from manual notifications', () => {
    const { container, rerender } = renderDetails({
      id: 'deadlineWarning',
      payload: { deadlines: [] }
    })
    expect(container).toBeEmptyDOMElement()
    rerender(
      <NotificationDetails
        notification={notification({ id: '3dPrintStatus' })}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
