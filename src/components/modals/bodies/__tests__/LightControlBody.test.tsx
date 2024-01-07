import { fireEvent, screen } from '@testing-library/react'
import { LightControlModalParams } from '../../../../contexts/modalUtils'
import {
  getMockedEntityState,
  renderModalBody
} from '../../../../utils/testUtils'
import LightControlBody from '../LightControlBody'

const callService = jest.fn()
jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

jest.mock('../../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn()
  }
})

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../../api/hooks')

type RenderParams = {
  turnedOn?: boolean
  colorTempSupported?: boolean
  brightnessValue?: number
  colorTempValue?: number
  modalParams?: Partial<LightControlModalParams>
}

const renderLightControlBody = ({
  turnedOn = true,
  colorTempSupported = true,
  brightnessValue = 127,
  colorTempValue = 2000,
  modalParams = {}
}: RenderParams = {}) => {
  useHomeAssistantEntity.mockImplementation(() =>
    getMockedEntityState('entity', turnedOn ? 'on' : 'off', {
      min_color_temp_kelvin: colorTempSupported ? 1000 : undefined,
      max_color_temp_kelvin: colorTempSupported ? 4000 : undefined,
      brightness: turnedOn ? brightnessValue : undefined,
      color_temp_kelvin:
        turnedOn && colorTempSupported ? colorTempValue : undefined
    })
  )
  return renderModalBody(<LightControlBody />, 'lightControl', {
    title: 'modal-title',
    entityId: 'entity',
    ...modalParams
  })
}
describe('LightControlBody', () => {
  it('should render modal with brightness and color temperature control bars', () => {
    renderLightControlBody()
    expect(screen.getByText('modal-title')).toBeInTheDocument()
    expect(screen.getByText('Brightness')).toBeInTheDocument()
    expect(screen.getByTestId('slider-Brightness')).toBeInTheDocument()
    expect(screen.getByText('Color temperature')).toBeInTheDocument()
    expect(screen.getByTestId('slider-Color temperature')).toBeInTheDocument()
    expect(screen.getByText('50% | 2000K')).toBeInTheDocument()
  })

  it('should hide color temperature if entity does not support that', () => {
    renderLightControlBody({
      colorTempSupported: false
    })
    expect(screen.queryByText('Color temperature')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('slider-Color temperature')
    ).not.toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should disallow to change the color temperature by user', () => {
    renderLightControlBody({
      modalParams: { lockColorTemperature: true }
    })
    expect(screen.queryByText('Color temperature')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('slider-Color temperature')
    ).not.toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should call ha service and change the brightness', () => {
    renderLightControlBody()
    fireEvent.mouseDown(screen.getByTestId('slider-Brightness'))
    fireEvent.mouseUp(screen.getByTestId('slider-Brightness'))
    expect(callService).toHaveBeenCalledWith('entity', 'light', 'turn_on', {
      brightness: 127
    })
  })

  it('should call turn_off service if brightness is set to 0', () => {
    renderLightControlBody({
      brightnessValue: 0
    })
    fireEvent.mouseDown(screen.getByTestId('slider-Brightness'))
    fireEvent.mouseUp(screen.getByTestId('slider-Brightness'))
    expect(callService).toHaveBeenCalledWith('entity', 'light', 'turn_off')
  })

  it('should call ha service and change the color temperature', () => {
    renderLightControlBody()
    fireEvent.mouseDown(screen.getByTestId('slider-Color temperature'))
    fireEvent.mouseUp(screen.getByTestId('slider-Color temperature'))
    expect(callService).toHaveBeenCalledWith('entity', 'light', 'turn_on', {
      kelvin: 2000
    })
  })

  it('should turn off light after clicking the footer button', () => {
    renderLightControlBody()
    fireEvent.click(screen.getByTestId('modal-button-Turn off'))
    expect(callService).toHaveBeenCalledWith('entity', 'light', 'turn_off')
  })

  it('should turn on light after clicking the footer button', () => {
    renderLightControlBody({
      turnedOn: false
    })
    fireEvent.click(screen.getByTestId('modal-button-Turn on'))
    expect(callService).toHaveBeenCalledWith('entity', 'light', 'turn_on')
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderLightControlBody()
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
