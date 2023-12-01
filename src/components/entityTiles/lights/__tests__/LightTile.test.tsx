import { fireEvent, render, screen } from '@testing-library/react'
import LightTile, { LightTileProps } from '../LightTile'
import { getMockedEntityState, holdTest } from '../../../../utils/testUtils'

const callService = jest.fn()
jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
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
  entityId: 'entityName'
}

const mockLightState = (turnedOn = true, colorTempSupported = true) => {
  useHomeAssistantEntity.mockImplementation(() =>
    getMockedEntityState('entityName', turnedOn ? 'on' : 'off', {
      brightness: turnedOn ? 127 : undefined,
      color_temp_kelvin: turnedOn && colorTempSupported ? 3000 : undefined,
      min_color_temp_kelvin: colorTempSupported ? 1000 : undefined,
      max_color_temp_kelvin: colorTempSupported ? 4000 : undefined,
      supported_color_modes: ['color_temp', 'brightness', 'onoff']
    })
  )
}

describe('LightTile', () => {
  it('should display the bulb light tile', () => {
    mockLightState()
    render(<LightTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('on')).toBeInTheDocument()
    expect(screen.getByTestId('LightbulbOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('LightbulbOutlinedIcon')).toHaveClass(
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

  it('should toggle light on click', () => {
    mockLightState()
    const { rerender } = render(<LightTile {...testProps} />)
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    expect(callService).toHaveBeenLastCalledWith(
      'entityName_id',
      'light',
      'turn_off'
    )
    expect(callService).toHaveBeenCalledTimes(1)

    mockLightState(false)
    rerender(<LightTile {...testProps} />)
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    expect(callService).toHaveBeenLastCalledWith(
      'entityName_id',
      'light',
      'turn_on'
    )
    expect(callService).toHaveBeenCalledTimes(2)
  })

  it('should open light control modal on hold', async () => {
    mockLightState()
    render(<LightTile {...testProps} lockColorTemperature />)
    fireEvent.mouseDown(screen.getByText('title'))
    await holdTest(1100)
    fireEvent.mouseUp(screen.getByText('title'))
    expect(openModalMock).toHaveBeenLastCalledWith('lightControl', {
      title: 'title',
      entityName: 'entityName',
      lockColorTemperature: true
    })
    expect(openModalMock).toHaveBeenCalledTimes(1)
  })

  it('should disallow to toggle the light on click', async () => {
    mockLightState()
    render(<LightTile {...testProps} disableToggle />)
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await holdTest(500)
    expect(callService).not.toHaveBeenCalled()
  })

  it('should disallow to open the manual control modal on hold', async () => {
    mockLightState()
    render(<LightTile {...testProps} disableManualControl />)
    fireEvent.mouseDown(screen.getByText('title'))
    await holdTest(1100)
    fireEvent.mouseUp(screen.getByText('title'))
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
    expect(screen.getByTestId('LightbulbIcon')).toBeInTheDocument()
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
    expect(screen.queryByText('3000K')).not.toBeInTheDocument()
  })
})
