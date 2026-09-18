import { act, render, screen } from '@testing-library/react'
import NotificationDot from '../NotificationDot'
import { NotificationPayload } from '../../../api/backend/notificationTypes'

let serviceDataSubscriber: (data: unknown) => void
const subscribeToServiceDataMock = jest.fn(
  (callback: (data: unknown) => void) => {
    serviceDataSubscriber = callback
    return jest.fn()
  }
)

jest.mock('../../../contexts/BackendContext', () => ({
  useBackend: () => ({
    subscribeToServiceData: subscribeToServiceDataMock
  })
}))

const notification = (
  id: string,
  custom: Partial<NotificationPayload> = {}
): NotificationPayload => ({
  id,
  title: id,
  description: id,
  priorityOrder: 'medium',
  canBeDismissed: true,
  createdAt: '2023-05-05T12:00:00Z',
  ...custom
})

const publishNotifications = (active: NotificationPayload[]) => {
  act(() => {
    serviceDataSubscriber({
      notifications: {
        active,
        availableIds: [],
        dndMode: false
      }
    })
  })
}

describe('NotificationDot', () => {
  beforeEach(() => {
    subscribeToServiceDataMock.mockClear()
  })

  it('stays hidden without active notifications', () => {
    render(<NotificationDot />)
    publishNotifications([])
    expect(screen.queryByTestId('notification-dot')).not.toBeInTheDocument()
  })

  it.each([
    ['redFlashing', 'bg-red-600'],
    ['yellow', 'bg-yellow-600'],
    ['green', 'bg-green-600'],
    ['blueFlashing', 'bg-blue-600'],
    ['purple', 'bg-purple-600']
  ] as const)('uses the %s notification color', (light, expectedClass) => {
    render(<NotificationDot />)
    publishNotifications([notification('important', { light })])
    expect(screen.getByTestId('notification-dot')).toHaveClass(expectedClass)
  })

  it('uses the first colored notification from the priority-sorted list', () => {
    render(<NotificationDot />)
    publishNotifications([
      notification('without-color'),
      notification('blue', { light: 'blue' }),
      notification('red', { light: 'red' })
    ])
    expect(screen.getByTestId('notification-dot')).toHaveClass('bg-blue-600')
  })

  it('uses white when all active notifications have no color', () => {
    render(<NotificationDot />)
    publishNotifications([
      notification('first'),
      notification('second', { priorityOrder: 'low' })
    ])
    expect(screen.getByTestId('notification-dot')).toHaveClass('bg-white')
  })
})
