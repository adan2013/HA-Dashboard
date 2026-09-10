import { act, fireEvent, render, screen } from '@testing-library/react'
import TileSection from '../TileSection'
import TileGroup from '../TileGroup'
import LightTile from '../../entityTiles/lights/LightTile'
import BackendLogsTile from '../../backendTiles/BackendLogsTile'
import Tile from '../../basic/Tile'
import PlaceholderTile from '../../../PlaceholderTile'
import ChartHistoryTile from '../../charts/ChartHistoryTile'
import { getMockedEntityState } from '../../../utils/testUtils'
import {
  BackendConnectionState,
  HomeAssistantConnectionState,
  EntityListenerCallback,
  SensorHistoryItem
} from '../../../api/utils'

const openModal = jest.fn()
const connectionListeners = new Set<(state: BackendConnectionState) => void>()
const haListeners = new Set<(state: HomeAssistantConnectionState) => void>()
const entityListeners = new Map<string, EntityListenerCallback>()
let entityListener: EntityListenerCallback
let backendStatus: BackendConnectionState = 'synced'
let haStatus: HomeAssistantConnectionState = 'synced'
const backend = {
  subscribeToConnectionStatus: jest.fn(callback => {
    connectionListeners.add(callback)
    callback(backendStatus)
    return () => connectionListeners.delete(callback)
  }),
  subscribeToHomeAssistantStatus: jest.fn(callback => {
    haListeners.add(callback)
    callback(haStatus)
    return () => haListeners.delete(callback)
  }),
  subscribeToEntity: jest.fn((id, callback) => {
    entityListener = callback
    entityListeners.set(id, callback)
    return () => entityListeners.delete(id)
  }),
  getSensorHistory: jest.fn(() => Promise.resolve<SensorHistoryItem[]>([])),
  callService: jest.fn()
}

jest.mock('../../../contexts/BackendContext', () => ({
  useBackend: () => backend
}))
jest.mock('../../../contexts/ModalContext', () => ({
  useModalContext: () => ({ openModal })
}))

const renderSection = () =>
  render(
    <TileSection>
      <TileGroup name="System">
        <LightTile title="Light" entityId="light.test" />
        <BackendLogsTile />
        <Tile title="Large tile" size="big" />
        <Tile title="Wide tile" size="horizontal" />
        <PlaceholderTile title="Future tile" size="standard" />
      </TileGroup>
    </TileSection>
  )

const changeHAStatus = (status: HomeAssistantConnectionState) => {
  act(() => {
    haStatus = status
    haListeners.forEach(listener => listener(status))
  })
}

describe('TileSection loading and outages', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    backendStatus = 'synced'
    haStatus = 'synced'
    connectionListeners.clear()
    haListeners.clear()
    entityListeners.clear()
  })

  afterEach(() => jest.useRealTimers())

  it('should reveal tiles across groups together only when the last entity arrives', () => {
    render(
      <TileSection>
        <TileGroup name="First">
          <LightTile title="First light" entityId="light.first" />
          <PlaceholderTile title="Future tile" size="standard" />
        </TileGroup>
        <TileGroup name="Second">
          <LightTile title="Second light" entityId="light.second" />
          <BackendLogsTile />
        </TileGroup>
      </TileSection>
    )
    expect(screen.getAllByRole('status')).toHaveLength(4)
    expect(screen.queryByText('Future tile')).not.toBeInTheDocument()
    act(() =>
      entityListeners.get('light.first')(
        getMockedEntityState('light.first', 'on').entityState,
        'synced'
      )
    )
    expect(screen.getAllByRole('status')).toHaveLength(4)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    act(() =>
      entityListeners.get('light.second')(
        getMockedEntityState('light.second', 'off').entityState,
        'synced'
      )
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Future tile')).toBeVisible()
    expect(screen.getByRole('button', { name: 'First light' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Second light' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Backend logs' })).toBeEnabled()
  })

  it('should wait for chart history without preventing the request from starting', async () => {
    let resolveHistory: (data: SensorHistoryItem[]) => void
    backend.getSensorHistory.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveHistory = resolve
        })
    )
    render(
      <TileSection>
        <ChartHistoryTile
          title="Temperature"
          entityId="sensor.temp"
          unit="°C"
          hideChart
        />
        <PlaceholderTile title="Future tile" size="standard" />
      </TileSection>
    )
    expect(backend.getSensorHistory).toHaveBeenCalledWith('sensor.temp')
    act(() =>
      entityListener(
        getMockedEntityState('sensor.temp', '24').entityState,
        'synced'
      )
    )
    expect(screen.getAllByRole('status')).toHaveLength(2)
    await act(async () => resolveHistory([]))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Future tile')).toBeVisible()
    expect(screen.getByText('24')).toBeVisible()
  })

  it('should release the group when a pending tile is removed', () => {
    const { rerender } = render(
      <TileSection>
        <Tile key="pending" title="Pending" isLoading />
        <PlaceholderTile
          key="placeholder"
          title="Future tile"
          size="standard"
        />
      </TileSection>
    )
    expect(screen.getAllByRole('status')).toHaveLength(2)
    rerender(
      <TileSection>
        <PlaceholderTile
          key="placeholder"
          title="Future tile"
          size="standard"
        />
      </TileSection>
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Future tile')).toBeVisible()
  })

  it('should not let a missing entity block the remaining tiles', () => {
    renderSection()
    expect(screen.getByLabelText('Loading Future tile')).toBeInTheDocument()
    act(() => entityListener(null, 'synced'))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Light' })).toBeDisabled()
    expect(screen.getByText('Future tile')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Backend logs' })).toBeEnabled()
  })

  it('should keep loading state scoped to its own section', () => {
    render(
      <>
        <TileSection>
          <Tile title="Pending" isLoading />
          <PlaceholderTile title="Waiting tile" size="standard" />
        </TileSection>
        <TileSection>
          <PlaceholderTile title="Ready tile" size="standard" />
        </TileSection>
      </>
    )
    expect(screen.getByLabelText('Loading Waiting tile')).toBeInTheDocument()
    expect(screen.getByText('Ready tile')).toBeVisible()
  })

  it.each(['disconnected', 'authError'] as const)(
    'should release diagnostics during an HA %s state even if another tile stays pending',
    status => {
      render(
        <TileSection>
          <Tile title="Pending" isLoading />
          <BackendLogsTile />
        </TileSection>
      )
      expect(screen.getByLabelText('Loading Backend logs')).toBeInTheDocument()
      changeHAStatus(status)
      fireEvent.click(screen.getByRole('button', { name: 'Backend logs' }))
      expect(openModal).toHaveBeenCalledWith('backendLogs')
    }
  )

  it('should show a skeleton until the entity arrives, then reveal its actual state', () => {
    renderSection()
    expect(screen.getByLabelText('Loading Light')).toHaveAttribute(
      'aria-busy',
      'true'
    )
    expect(screen.queryByText('Off')).not.toBeInTheDocument()
    act(() =>
      entityListener(
        getMockedEntityState('light.test', 'on').entityState,
        'synced'
      )
    )
    expect(screen.queryByLabelText('Loading Light')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Light' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Light' }))
    expect(backend.callService).toHaveBeenCalledWith(
      'light.test',
      'light',
      'turn_off'
    )
  })

  it('should keep backend logs accessible when HA is offline, without remounting tiles', () => {
    renderSection()
    act(() =>
      entityListener(
        getMockedEntityState('light.test', 'on').entityState,
        'synced'
      )
    )
    const subscriptions = backend.subscribeToEntity.mock.calls.length
    changeHAStatus('disconnected')
    expect(screen.getByText('System')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Light' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Backend logs' }))
    expect(openModal).toHaveBeenCalledWith('backendLogs')
    expect(backend.subscribeToEntity).toHaveBeenCalledTimes(subscriptions)
  })

  it('should open the section during an existing HA outage', () => {
    haStatus = 'disconnected'
    renderSection()
    expect(screen.queryByLabelText('Loading Light')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Backend logs' }))
    expect(openModal).toHaveBeenCalledWith('backendLogs')
  })

  it('should show an unavailable tile after a missing or failed entity response', () => {
    renderSection()
    expect(screen.getByLabelText('Loading Future tile')).toBeInTheDocument()
    act(() => jest.advanceTimersByTime(9999))
    expect(screen.getByLabelText('Loading Future tile')).toBeInTheDocument()
    act(() => jest.advanceTimersByTime(1))
    expect(screen.queryByLabelText('Loading Light')).not.toBeInTheDocument()
    expect(screen.getByText('Future tile')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Light' })).toBeDisabled()
    act(() =>
      entityListener(
        getMockedEntityState('light.test', 'on').entityState,
        'synced'
      )
    )
    expect(screen.getByRole('button', { name: 'Light' })).toBeEnabled()
    act(() => entityListener(null, 'synced'))
    expect(screen.queryByLabelText('Loading Light')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Light' })).toBeDisabled()
  })

  it('should load fresh entity data after HA recovers', () => {
    renderSection()
    act(() =>
      entityListener(
        getMockedEntityState('light.test', 'on').entityState,
        'synced'
      )
    )
    changeHAStatus('disconnected')
    changeHAStatus('synced')
    expect(screen.getByLabelText('Loading Light')).toBeInTheDocument()
    act(() =>
      entityListener(
        getMockedEntityState('light.test', 'off').entityState,
        'synced'
      )
    )
    fireEvent.click(screen.getByRole('button', { name: 'Light' }))
    expect(backend.callService).toHaveBeenCalledWith(
      'light.test',
      'light',
      'turn_on'
    )
  })

  it('should disable HA controls inside a tile while leaving backend actions enabled', () => {
    haStatus = 'disconnected'
    render(
      <TileSection>
        <Tile
          title="Remote"
          requiresHomeAssistant
          customBody={<button type="button">Remote action</button>}
        />
        <Tile title="Reboot HA" requiresHomeAssistant onClick={jest.fn()} />
        <BackendLogsTile />
      </TileSection>
    )
    expect(screen.getByRole('button', { name: 'Remote action' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reboot HA' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Backend logs' })).toBeEnabled()
  })

  it('should preserve the real tile sizes while connecting to the backend', () => {
    backendStatus = 'disconnected'
    haStatus = 'disconnected'
    renderSection()
    expect(screen.getByText('System')).toBeVisible()
    expect(screen.getByLabelText('Loading Large tile')).toHaveClass(
      'col-span-2',
      'row-span-2'
    )
    expect(screen.getByLabelText('Loading Wide tile')).toHaveClass(
      'col-span-2',
      'aspect-[2/1]'
    )
    expect(connectionListeners.size).toBeGreaterThan(0)
    act(() => connectionListeners.forEach(listener => listener('synced')))
    expect(screen.getByRole('button', { name: 'Backend logs' })).toBeEnabled()
  })
})
