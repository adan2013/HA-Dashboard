import { act, fireEvent, render, screen } from '@testing-library/react'
import SwitchGroupTile from '../SwitchGroupTile'
import { getMockedEntityState } from '../../../../utils/testUtils'
import {
  HomeAssistantEntityData,
  useHomeAssistantEntity
} from '../../../../api/hooks'
import { TileConnectionContextProvider } from '../../../../contexts/TileConnectionContext'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    callService
  }))
}))

jest.mock('../../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useBackendStatus: jest.fn(() => 'synced'),
    useHomeAssistantStatus: jest.fn(() => 'synced'),
    useHomeAssistantEntity: jest.fn()
  }
})

const entityCache = new Map<string, HomeAssistantEntityData>()

// The real hook keeps entity data in React state, so repeated renders
// return the same objects.
const mockEntity = (entityId: string, state: string, isLoading = false) => {
  const key = `${entityId}:${state}:${isLoading}`
  if (!entityCache.has(key)) {
    const data = getMockedEntityState(entityId, state)
    entityCache.set(key, {
      ...data,
      isLoading,
      isUnavailable: state === 'unavailable'
    })
  }
  return entityCache.get(key)
}

const states: Record<string, string> = {
  'switch.first': 'on',
  'switch.second': 'off',
  'switch.third': 'unavailable'
}

const renderTile = () =>
  render(
    <SwitchGroupTile
      title="Options"
      switches={[
        { title: 'First', entityId: 'switch.first' },
        { title: 'Second', entityId: 'switch.second' },
        { title: 'Third', entityId: 'switch.third' }
      ]}
    />
  )

describe('SwitchGroupTile', () => {
  beforeEach(() => {
    ;(useHomeAssistantEntity as jest.Mock).mockImplementation(
      (entityId: string) => mockEntity(entityId, states[entityId])
    )
  })

  it('should keep the section skeleton stable while an entity is loading', () => {
    const hook = useHomeAssistantEntity as jest.Mock
    hook.mockImplementation((entityId: string) =>
      mockEntity(entityId, states[entityId], entityId === 'switch.second')
    )
    render(
      <TileConnectionContextProvider>
        <SwitchGroupTile
          title="Options"
          switches={[
            { title: 'First', entityId: 'switch.first' },
            { title: 'Second', entityId: 'switch.second' }
          ]}
        />
      </TileConnectionContextProvider>
    )
    expect(screen.getByLabelText('Loading Options')).toBeInTheDocument()
    const callsAfterMount = hook.mock.calls.length

    act(() => undefined)
    expect(hook.mock.calls.length).toBe(callsAfterMount)
    expect(screen.getByLabelText('Loading Options')).toBeInTheDocument()
  })

  it('should render only the switches, without the tile header', () => {
    renderTile()
    expect(screen.queryByTestId('tile-header')).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Options' })).toBeVisible()
    expect(screen.getByText('First')).toBeVisible()
    expect(screen.getByText('Second')).toBeVisible()
    expect(screen.getByText('Third')).toBeVisible()
  })

  it('should show the state of each switch', () => {
    renderTile()
    const first = screen.getByRole('button', { name: 'First' })
    const second = screen.getByRole('button', { name: 'Second' })
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(
      first.querySelector('[data-testid=ToggleOnOutlinedIcon]')
    ).toBeTruthy()
    expect(second).toHaveAttribute('aria-pressed', 'false')
    expect(
      second.querySelector('[data-testid=ToggleOffOutlinedIcon]')
    ).toBeTruthy()
  })

  it('should toggle the pressed switch', () => {
    renderTile()
    fireEvent.click(screen.getByRole('button', { name: 'First' }))
    expect(callService).toHaveBeenCalledWith(
      'switch.first',
      'switch',
      'turn_off'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(callService).toHaveBeenCalledWith(
      'switch.second',
      'switch',
      'turn_on'
    )
  })

  it('should disable an unavailable switch', () => {
    renderTile()
    const third = screen.getByRole('button', { name: 'Third' })
    expect(third).toBeDisabled()
    fireEvent.click(third)
    expect(callService).not.toHaveBeenCalled()
  })
})
