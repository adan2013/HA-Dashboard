import { fireEvent, screen, waitFor } from '@testing-library/react'
import { BackendLogEntry } from '../../../../api/utils'
import { renderModalBody } from '../../../../utils/testUtils'
import BackendLogsBody from '../BackendLogsBody'

const entries: BackendLogEntry[] = [
  {
    time: '2026-09-07T10:00:00.000Z',
    level: 'info',
    scope: 'Application',
    message: 'Backend starting'
  },
  {
    time: '2026-09-07T10:01:00.000Z',
    level: 'error',
    scope: 'WeatherService',
    message: 'Weather refresh failed',
    details: { entityId: 'weather.home' }
  }
]

jest.mock('../../../../contexts/BackendContext', () => {
  const mockBackend = {
    getBackendLogs: jest.fn()
  }
  return {
    useBackend: () => mockBackend,
    mockBackend
  }
})

const { mockBackend } = jest.requireMock(
  '../../../../contexts/BackendContext'
) as {
  mockBackend: {
    getBackendLogs: jest.Mock<Promise<BackendLogEntry[]>, []>
  }
}
const { getBackendLogs } = mockBackend

const renderBackendLogsBody = () =>
  renderModalBody(<BackendLogsBody />, 'backendLogs')

describe('BackendLogsBody', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getBackendLogs.mockResolvedValue(entries)
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 321
    })
  })

  it('loads, displays and scrolls to the latest backend logs', async () => {
    renderBackendLogsBody()

    expect(await screen.findByText('Backend starting')).toBeInTheDocument()
    expect(screen.getByText('Weather refresh failed')).toBeInTheDocument()
    expect(screen.getByText('ERROR')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('backend-logs-container').scrollTop).toBe(321)
    })
  })

  it('keeps the current logs visible when refresh fails', async () => {
    renderBackendLogsBody()
    expect(await screen.findByText('Backend starting')).toBeInTheDocument()
    getBackendLogs.mockRejectedValueOnce(new Error('Backend unavailable'))

    await waitFor(() => {
      expect(screen.getByTestId('modal-button-Refresh')).not.toHaveClass(
        'text-gray-600'
      )
    })

    fireEvent.click(screen.getByTestId('modal-button-Refresh'))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Backend unavailable'
    )
    expect(screen.getByText('Backend starting')).toBeInTheDocument()
  })

  it('closes the modal', async () => {
    const { closeModalMock } = renderBackendLogsBody()
    await screen.findByText('Backend starting')

    fireEvent.click(screen.getByTestId('modal-button-Close'))

    expect(closeModalMock).toHaveBeenCalled()
  })
})
