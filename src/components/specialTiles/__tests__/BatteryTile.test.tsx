import { render, screen } from '@testing-library/react'
import { BatteryTile } from '../BatteryTile'
import { BatteryState } from '../../../utils/batteryUtils'
import { getBatteryEntity } from '../../../utils/testUtils'

const testEntities: BatteryState[] = [
  getBatteryEntity('device1', 10),
  getBatteryEntity('device2', 45),
  getBatteryEntity('device3', 70),
  getBatteryEntity('device4', 15),
  getBatteryEntity('device5', 40),
  getBatteryEntity('device6', 100)
]

jest.mock('../../../api/hooks', () => ({
  useHomeAssistantBatteries: () => testEntities
}))

describe('BatteryTile', () => {
  it('should render a list of devices with low battery indicators', () => {
    render(<BatteryTile />)
    expect(screen.getByText('Batteries')).toBeInTheDocument()
    expect(screen.getByTestId('device1_name-0')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(screen.getByTestId('device4_name-3')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('See more (1)')).toBeInTheDocument()
    expect(screen.getByTestId('device1_name-low-battery')).toBeInTheDocument()
    expect(screen.getByTestId('device4_name-low-battery')).toBeInTheDocument()
  })
})
