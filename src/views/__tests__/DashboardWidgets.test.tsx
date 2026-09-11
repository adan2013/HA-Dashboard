import { act, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ServiceDataObject } from '../../api/backend/backendTypes'
import { useBackend } from '../../contexts/BackendContext'
import Notifications from '../Notifications'
import Weather from '../Weather'

let mockIsMobileLayout = false

jest.mock('../../contexts/BackendContext', () => ({
  useBackend: jest.fn()
}))

jest.mock('../../contexts/OutletContext', () => ({
  useLayoutContext: () => ({ isMobile: mockIsMobileLayout })
}))

const useBackendMock = useBackend as jest.Mock

describe('dashboard widgets loading state', () => {
  let serviceDataListener: (data: ServiceDataObject) => void

  beforeEach(() => {
    mockIsMobileLayout = false
    useBackendMock.mockReturnValue({
      subscribeToServiceData: jest.fn(callback => {
        serviceDataListener = callback
        callback(null)
        return jest.fn()
      })
    })
  })

  it('should keep the weather empty state hidden until the initial snapshot arrives', () => {
    render(
      <BrowserRouter>
        <Weather isWidget />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Loading weather')).toBeVisible()
    expect(screen.queryByText('NO FORECAST AVAILABLE')).not.toBeInTheDocument()

    act(() => {
      serviceDataListener({} as ServiceDataObject)
    })

    expect(screen.queryByLabelText('Loading weather')).not.toBeInTheDocument()
    expect(screen.getByText('NO FORECAST AVAILABLE')).toBeVisible()
  })

  it('should keep the full weather empty state hidden until the initial snapshot arrives', () => {
    render(
      <BrowserRouter>
        <Weather />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Loading weather details')).toBeVisible()
    expect(screen.queryByText('NO FORECAST AVAILABLE')).not.toBeInTheDocument()

    act(() => {
      serviceDataListener({} as ServiceDataObject)
    })

    expect(
      screen.queryByLabelText('Loading weather details')
    ).not.toBeInTheDocument()
    expect(screen.getByText('NO FORECAST AVAILABLE')).toBeVisible()
  })

  it('should use the full mobile weather skeleton outside the dashboard widget', () => {
    mockIsMobileLayout = true

    render(
      <BrowserRouter>
        <Weather />
      </BrowserRouter>
    )

    expect(screen.getByTestId('mobile-weather-skeleton')).toBeVisible()
    expect(screen.queryByLabelText('Loading weather')).not.toBeInTheDocument()
  })

  it('should keep the calendar hidden until notification data arrives', () => {
    render(
      <BrowserRouter>
        <Notifications isWidget />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Loading notifications')).toBeVisible()
    expect(screen.queryByText('Mon')).not.toBeInTheDocument()

    act(() => {
      serviceDataListener({
        notifications: { active: [], availableIds: [], dndMode: false }
      } as ServiceDataObject)
    })

    expect(
      screen.queryByLabelText('Loading notifications')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeVisible()
  })

  it('should keep the full notifications empty state hidden until the initial snapshot arrives', () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Loading notification details')).toBeVisible()
    expect(
      screen.queryByText(/NO ACTIVE NOTIFICATIONS/i)
    ).not.toBeInTheDocument()

    act(() => {
      serviceDataListener({
        notifications: { active: [], availableIds: [], dndMode: false }
      } as ServiceDataObject)
    })

    expect(
      screen.queryByLabelText('Loading notification details')
    ).not.toBeInTheDocument()
    expect(screen.getByText(/NO ACTIVE NOTIFICATIONS/i)).toBeVisible()
  })
})
