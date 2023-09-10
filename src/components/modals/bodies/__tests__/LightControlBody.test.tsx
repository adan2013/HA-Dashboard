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

const renderLightControlBody = (
  turnedOn: boolean,
  colorTemp: boolean,
  params: Partial<LightControlModalParams> = {}
) => {
  useHomeAssistantEntity.mockImplementation(() =>
    getMockedEntityState('entityName', turnedOn ? 'on' : 'off', {
      min_color_temp_kelvin: colorTemp ? 1000 : undefined,
      max_color_temp_kelvin: colorTemp ? 4000 : undefined,
      brightness: turnedOn ? 127 : undefined,
      color_temp_kelvin: turnedOn && colorTemp ? 2000 : undefined
    })
  )
  return renderModalBody(<LightControlBody />, 'lightControl', {
    title: 'modal-title',
    entityName: 'entityName',
    ...params
  })
}
describe('LightControlBody', () => {
  it('should render modal with brightness and color temperature control bars', () => {
    renderLightControlBody(true, true)
    expect(screen.getByText('modal-title')).toBeInTheDocument()
    expect(screen.getByText('Brightness')).toBeInTheDocument()
    expect(screen.getByTestId('slider-Brightness')).toBeInTheDocument()
    expect(screen.getByText('Color temperature')).toBeInTheDocument()
    expect(screen.getByTestId('slider-Color temperature')).toBeInTheDocument()
    expect(screen.getByText('50% | 2000K')).toBeInTheDocument()
  })

  it('should hide color temperature if entity does not support that', () => {
    renderLightControlBody(true, false)
    expect(screen.queryByText('Color temperature')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('slider-Color temperature')
    ).not.toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should disallow to change the color temperature by user', () => {
    renderLightControlBody(true, true, { lockColorTemperature: true })
    expect(screen.queryByText('Color temperature')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('slider-Color temperature')
    ).not.toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should call ha service and change the brightness', () => {
    renderLightControlBody(true, true)
    fireEvent.mouseDown(screen.getByTestId('slider-Brightness'))
    fireEvent.mouseUp(screen.getByTestId('slider-Brightness'))
    expect(callService).toHaveBeenCalledWith(
      'entityName_id',
      'light',
      'turn_on',
      { brightness: 127 }
    )
  })

  it('should call ha service and change the color temperature', () => {
    renderLightControlBody(true, true)
    fireEvent.mouseDown(screen.getByTestId('slider-Color temperature'))
    fireEvent.mouseUp(screen.getByTestId('slider-Color temperature'))
    expect(callService).toHaveBeenCalledWith(
      'entityName_id',
      'light',
      'turn_on',
      { kelvin: 2000 }
    )
  })

  it('should turn off light after clicking the footer button', () => {
    renderLightControlBody(true, true)
    fireEvent.click(screen.getByTestId('modal-button-Turn off'))
    expect(callService).toHaveBeenCalledWith(
      'entityName_id',
      'light',
      'turn_off'
    )
  })

  it('should turn on light after clicking the footer button', () => {
    renderLightControlBody(false, true)
    fireEvent.click(screen.getByTestId('modal-button-Turn on'))
    expect(callService).toHaveBeenCalledWith(
      'entityName_id',
      'light',
      'turn_on'
    )
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderLightControlBody(true, true)
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
