import { fireEvent, screen } from '@testing-library/react'
import {
  getBatteryEntity,
  renderModalBody
} from '../../../../utils/testUtils'
import BatteryListBody from '../BatteryListBody'
import { BatteryState } from '../../../../utils/batteryUtils'

const testEntities: BatteryState[] = [
  getBatteryEntity('device1', 10),
  getBatteryEntity('device2', 20),
  getBatteryEntity('device3', 30)
]

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantBatteries: () => testEntities
}))

describe('BatteryListBody', () => {
  it('should render the battery list', () => {
    renderModalBody(<BatteryListBody />, 'batteryList')
    expect(screen.getByText('Batteries')).toBeInTheDocument()
    expect(screen.getByText('device1_name')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(screen.queryByText('Signal')).not.toBeInTheDocument()
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderModalBody(
      <BatteryListBody />,
      'batteryList'
    )
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
