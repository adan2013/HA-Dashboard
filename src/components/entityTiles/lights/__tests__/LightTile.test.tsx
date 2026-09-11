import { fireEvent, render, screen } from '@testing-library/react'
import LightTile, { LightTileProps } from '../LightTile'
import { getMockedEntityState } from '../../../../utils/testUtils'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    callService
  }))
}))

const openModalMock = jest.fn()
jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: jest.fn()
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../../api/hooks')

const testProps: LightTileProps = {
  title: 'title',
  entityId: 'entity'
}

const mockLightState = (turnedOn = true, colorTempSupported = true) => {
  useHomeAssistantEntity.mockImplementation(() =>
    getMockedEntityState('entity', turnedOn ? 'on' : 'off', {
      brightness: turnedOn ? 127 : undefined,
      color_temp_kelvin: turnedOn && colorTempSupported ? 3000 : undefined,
      min_color_temp_kelvin: colorTempSupported ? 1000 : undefined,
      max_color_temp_kelvin: colorTempSupported ? 4000 : undefined,
      hs_color: turnedOn && colorTempSupported ? [55, 50] : undefined,
      supported_color_modes: ['color_temp', 'brightness', 'onoff']
    })
  )
}

describe('LightTile', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should display the bulb light tile', () => {
    mockLightState()
    render(<LightTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('on')).toBeInTheDocument()
    expect(screen.getByTestId('LightbulbIcon')).toBeInTheDocument()
    expect(screen.getByTestId('LightbulbIcon')).toHaveClass(
      'text-yellow-500'
    )
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('3000K')).toBeInTheDocument()
  })

  it('should display the ceiling light tile', () => {
    mockLightState()
    render(<LightTile {...testProps} lightType="ceiling" />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('on')).toBeInTheDocument()
    expect(screen.getByTestId('LightIcon')).toBeInTheDocument()
    expect(screen.getByTestId('LightIcon')).toHaveClass('text-yellow-500')
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('3000K')).toBeInTheDocument()
  })

  it('should display the active RGB color on the tile', () => {
    useHomeAssistantEntity.mockImplementation(() =>
      getMockedEntityState('entity', 'on', {
        brightness: 255,
        rgb_color: [255, 5, 25],
        supported_color_modes: ['rgb']
      })
    )
    render(<LightTile {...testProps} />)
    expect(screen.getByTestId('LightbulbIcon')).toHaveStyle('color: #FF0519')
    expect(screen.getByText('#FF0519')).toBeInTheDocument()
  })

  it('should display HS-only colors as HEX values', () => {
    useHomeAssistantEntity.mockImplementation(() =>
      getMockedEntityState('entity', 'on', {
        brightness: 255,
        hs_color: [180, 100],
        supported_color_modes: ['hs']
      })
    )
    render(<LightTile {...testProps} />)
    expect(screen.getByTestId('LightbulbIcon')).toHaveStyle('color: #00FFFF')
    expect(screen.getByText('#00FFFF')).toBeInTheDocument()
  })

  it('should toggle light on click', () => {
    mockLightState()
    const { rerender } = render(<LightTile {...testProps} />)
    fireEvent.click(screen.getByText('title'))
    expect(callService).toHaveBeenLastCalledWith('entity', 'light', 'turn_off')
    expect(callService).toHaveBeenCalledTimes(1)

    mockLightState(false)
    rerender(<LightTile {...testProps} />)
    fireEvent.click(screen.getByText('title'))
    expect(callService).toHaveBeenLastCalledWith('entity', 'light', 'turn_on')
    expect(callService).toHaveBeenCalledTimes(2)
  })

  it('should open light control modal on hold', () => {
    mockLightState()
    render(<LightTile {...testProps} lockColorTemperature />)
    fireEvent.contextMenu(screen.getByText('title'))
    expect(openModalMock).toHaveBeenLastCalledWith('lightControl', {
      title: 'title',
      entityId: 'entity',
      lockColorTemperature: true
    })
    expect(openModalMock).toHaveBeenCalledTimes(1)
  })

  it('should disallow to toggle the light on click', () => {
    mockLightState()
    render(<LightTile {...testProps} disableToggle />)
    fireEvent.click(screen.getByText('title'))
    jest.advanceTimersByTime(500)
    expect(callService).not.toHaveBeenCalled()
  })

  it('should disallow to open the manual control modal on hold', () => {
    mockLightState()
    render(<LightTile {...testProps} disableManualControl />)
    fireEvent.contextMenu(screen.getByText('title'))
    expect(openModalMock).not.toHaveBeenCalled()
  })

  it('should hide color temperature if light does not support that', () => {
    mockLightState(true, false)
    render(<LightTile {...testProps} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.queryByText('3000K')).not.toBeInTheDocument()
  })

  it('should block and hide color temperature control', () => {
    mockLightState()
    render(<LightTile {...testProps} lockColorTemperature />)
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.queryByText('3000K')).not.toBeInTheDocument()
  })

  it('should render light tile in off state', () => {
    mockLightState(false)
    render(<LightTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('off')).toBeInTheDocument()
    expect(screen.getByTestId('LightbulbOutlinedIcon')).toBeInTheDocument()
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
    expect(screen.queryByText('3000K')).not.toBeInTheDocument()
  })
})
