import { fireEvent, render, screen } from '@testing-library/react'
import { getMockedEntityState } from '../../../utils/testUtils'
import { EntityAttributeInterface } from '../../../api/utils'
import AirConditionerTile from '../AirConditionerTile'

const AC_ENTITY_ID = 'climate.airconditioner'

const defaultAttributes: Partial<EntityAttributeInterface> = {
  current_temperature: 28,
  temperature: 23,
  fan_mode: 'auto',
  fan_modes: ['auto', 'low', 'medium', 'high']
}

const callService = jest.fn()
jest.mock('../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

jest.mock('../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn()
  }
})

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../api/hooks')

const clickButton = (btn: HTMLElement) => {
  fireEvent.mouseDown(btn)
  fireEvent.mouseUp(btn)
}

const renderAirConditionerTile = (
  state = 'off',
  attributes = defaultAttributes,
  isUnavailable = false
) => {
  useHomeAssistantEntity.mockImplementationOnce(() =>
    isUnavailable
      ? {
          entityState: null,
          isUnavailable: true
        }
      : getMockedEntityState(AC_ENTITY_ID, state, attributes)
  )
  callService.mockClear()
  return {
    ...render(
      <AirConditionerTile title="Gree AC unit" entityId={AC_ENTITY_ID} />
    ),
    outputs: {
      mode: screen.getByTestId('status-mode'),
      currentTemp: screen.getByTestId('status-current-temp'),
      fan: screen.getByTestId('status-fan'),
      targetTemp: screen.getByTestId('status-target-temp')
    },
    inputs: {
      tempDown: screen.getByTestId('btn-temp-down'),
      tempUp: screen.getByTestId('btn-temp-up'),
      fanAuto: screen.getByTestId('btn-fan-auto'),
      fanDown: screen.getByTestId('btn-fan-down'),
      fanUp: screen.getByTestId('btn-fan-up'),
      offMode: screen.getByTestId('btn-off-mode'),
      fanMode: screen.getByTestId('btn-fan-mode'),
      coolMode: screen.getByTestId('btn-cool-mode'),
      autoMode: screen.getByTestId('btn-auto-mode')
    }
  }
}

describe('AirConditionerTile', () => {
  describe('status outputs', () => {
    it('should render the tile with the correct values', () => {
      const { outputs } = renderAirConditionerTile()
      expect(screen.getByText('Gree AC unit')).toBeVisible()
      expect(outputs.mode).toHaveTextContent('Off')
      expect(outputs.currentTemp).toHaveTextContent('28°')
      expect(outputs.fan).toHaveTextContent('Auto')
      expect(outputs.targetTemp).toHaveTextContent('23°')
    })

    it('should render the tile with the correct values when entity is unavailable', () => {
      const { outputs } = renderAirConditionerTile(
        'unavailable',
        undefined,
        true
      )
      expect(screen.getByText('Gree AC unit')).toBeVisible()
      expect(outputs.mode).toHaveTextContent('--')
      expect(outputs.currentTemp).toHaveTextContent('--')
      expect(outputs.fan).toHaveTextContent('--')
      expect(outputs.targetTemp).toHaveTextContent('--')
    })

    describe('mode output', () => {
      it.each([
        ['--', 'unknown'],
        ['--', 'unavailable'],
        ['Auto', 'auto'],
        ['Cool', 'cool'],
        ['Fan', 'fan_only'],
        ['Dry', 'dry'],
        ['Off', 'off']
      ])(
        'should render the tile with correct %s mode if hvac is %s',
        (expectedLabel, hvacValue) => {
          const { outputs } = renderAirConditionerTile(
            hvacValue,
            defaultAttributes
          )
          expect(outputs.mode).toHaveTextContent(expectedLabel)
        }
      )
    })

    describe('fan output', () => {
      it.each([
        ['Auto', 'unknown'],
        ['Auto', 'unavailable'],
        ['Auto', 'auto'],
        ['1 / 3', 'low'],
        ['2 / 3', 'medium'],
        ['3 / 3', 'high'],
        ['Auto', 'unexpectedValue']
      ])(
        'should render the tile with correct %s fan mode if fanMode is %s',
        (expectedLabel, fanMode) => {
          const { outputs } = renderAirConditionerTile('fan', {
            ...defaultAttributes,
            fan_mode: fanMode
          })
          expect(outputs.fan).toHaveTextContent(expectedLabel)
        }
      )
    })
  })

  describe('target temperature control', () => {
    it('should decrease the target temperature', () => {
      const { inputs } = renderAirConditionerTile()
      clickButton(inputs.tempDown)
      expect(callService).toHaveBeenCalledWith(
        AC_ENTITY_ID,
        'climate',
        'set_temperature',
        {
          temperature: 22
        }
      )
    })

    it('should increase the target temperature', () => {
      const { inputs } = renderAirConditionerTile()
      clickButton(inputs.tempUp)
      expect(callService).toHaveBeenCalledWith(
        AC_ENTITY_ID,
        'climate',
        'set_temperature',
        {
          temperature: 24
        }
      )
    })
  })

  describe('fan mode control', () => {
    it('should switch fan mode to auto by clicking fan auto button', () => {
      const { inputs } = renderAirConditionerTile()
      clickButton(inputs.fanAuto)
      expect(callService).toHaveBeenCalledWith(
        AC_ENTITY_ID,
        'climate',
        'set_fan_mode',
        {
          fan_mode: 'auto'
        }
      )
    })

    describe('fan down button', () => {
      it.each([
        ['auto', 'high'],
        ['high', 'medium'],
        ['medium', 'low'],
        ['low', 'auto'],
        ['unexpectedValue', 'auto']
      ])(
        'should switch fan mode from %s to %s by clicking fan down button',
        (oldMode, newMode) => {
          const { inputs } = renderAirConditionerTile('fan', {
            ...defaultAttributes,
            fan_mode: oldMode
          })
          clickButton(inputs.fanDown)
          expect(callService).toHaveBeenCalledWith(
            AC_ENTITY_ID,
            'climate',
            'set_fan_mode',
            {
              fan_mode: newMode
            }
          )
        }
      )
    })

    describe('fan up button', () => {
      it.each([
        ['auto', 'low'],
        ['low', 'medium'],
        ['medium', 'high'],
        ['high', 'auto'],
        ['unexpectedValue', 'auto']
      ])(
        'should switch fan mode from %s to %s by clicking fan up button',
        (oldMode, newMode) => {
          const { inputs } = renderAirConditionerTile('fan', {
            ...defaultAttributes,
            fan_mode: oldMode
          })
          clickButton(inputs.fanUp)
          expect(callService).toHaveBeenCalledWith(
            AC_ENTITY_ID,
            'climate',
            'set_fan_mode',
            {
              fan_mode: newMode
            }
          )
        }
      )
    })
  })

  describe('mode control', () => {
    it('should switch AC between predefined modes', () => {
      const { inputs } = renderAirConditionerTile()
      const expectCall = (mode: string) =>
        expect(callService).toHaveBeenLastCalledWith(
          AC_ENTITY_ID,
          'climate',
          'set_hvac_mode',
          {
            hvac_mode: mode
          }
        )
      clickButton(inputs.offMode)
      expectCall('off')
      clickButton(inputs.fanMode)
      expectCall('fan_only')
      clickButton(inputs.coolMode)
      expectCall('cool')
      clickButton(inputs.autoMode)
      expectCall('auto')
    })
  })
})
