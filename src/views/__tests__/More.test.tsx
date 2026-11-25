import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import More from '../More'
import { useBackend } from '../../contexts/BackendContext'
import { ServiceManagerStatus } from '../../api/backend/backendTypes'

jest.mock('../../contexts/BackendContext', () => ({ useBackend: jest.fn() }))
jest.mock('../../contexts/ModalContext', () => ({
  useModalContext: () => ({ openModal: jest.fn() })
}))

const useBackendMock = useBackend as jest.Mock
const helper = (value: number | string) => ({
  color: 'green' as const,
  message: String(value),
  value,
  updatedAt: '2026-11-23T03:00:00Z',
  error: null
})

it('shows backend helper values in More, including zero counts and decimal balance', () => {
  const data: ServiceManagerStatus = {
    currentTime: '',
    startTime: '',
    daysRunning: 0,
    syncedEntitiesCount: 0,
    services: {
      backend: {
        status: { color: 'green', message: 'Ready' },
        helpers: {
          'value/version': helper('9.2.4'),
          'value/entitiesCount': helper(0)
        }
      },
      sms: {
        status: { color: 'green', message: 'Ready' },
        helpers: { 'value/balance': helper(0.05) }
      }
    }
  }
  useBackendMock.mockReturnValue({
    version: 'obsolete-welcome-version',
    statusData: data,
    requestServiceStatus: jest.fn(),
    subscribeToStatusData: callback => {
      callback(data)
      return jest.fn()
    },
    subscribeToConnectionStatus: callback => {
      callback('synced')
      return jest.fn()
    },
    subscribeToHomeAssistantStatus: callback => {
      callback('disconnected')
      return jest.fn()
    }
  })
  render(
    <MemoryRouter>
      <More />
    </MemoryRouter>
  )
  expect(screen.getByText('9.2.4')).toBeVisible()
  expect(screen.queryByText('obsolete-welcome-version')).not.toBeInTheDocument()
  const countTile = screen
    .getByText('Synced entities')
    .closest('[data-testid="tile-bg"]')
  expect(within(countTile as HTMLElement).getByText('0')).toBeVisible()
  const balanceTile = screen
    .getByText('SMS service balance')
    .closest('[data-testid="tile-bg"]')
  expect(within(balanceTile as HTMLElement).getByText('0.05')).toBeVisible()
  expect(within(balanceTile as HTMLElement).getByText('PLN')).toBeVisible()
  expect(screen.queryByText(/Updated/)).not.toBeInTheDocument()
})
