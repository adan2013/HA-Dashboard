import { fireEvent, render, screen } from '@testing-library/react'
import { getMockedEntityState } from '../../../../utils/testUtils'
import RadiatorTile from '../RadiatorTile'

const openModal = jest.fn()
jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({ openModal })
}))

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: jest.fn()
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../../api/hooks')

const props = {
  title: 'Living Room',
  entityId: 'climate.livingroomradiatorvalve',
  batteryEntityId: 'sensor.livingroomradiatorvalve_battery'
}

describe('RadiatorTile', () => {
  it('shows the live mode, action, internal sensor, battery and target', () => {
    useHomeAssistantEntity.mockImplementation((id: string) => {
      if (id === props.entityId)
        return getMockedEntityState(id, 'heat', {
          temperature: 26.5,
          current_temperature: 24.3,
          hvac_action: 'heating'
        })
      return getMockedEntityState(id, '97')
    })

    render(<RadiatorTile {...props} />)

    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Manual, Heating')).toBeInTheDocument()
    expect(screen.getByText('SEN 24.3°C')).toBeInTheDocument()
    expect(screen.getByText('BAT 97%')).toBeInTheDocument()
    expect(screen.getByText('26')).toBeInTheDocument()
    expect(screen.getByText('.5')).toBeInTheDocument()
    expect(screen.getByText('°C')).toBeInTheDocument()
    expect(useHomeAssistantEntity).toHaveBeenCalledWith(props.entityId)
    expect(useHomeAssistantEntity).toHaveBeenCalledWith(props.batteryEntityId)
    expect(useHomeAssistantEntity).toHaveBeenCalledTimes(2)

    fireEvent.click(screen.getByRole('button', { name: 'Living Room' }))
    expect(openModal).toHaveBeenCalledWith('radiatorControl', props)
  })
})
