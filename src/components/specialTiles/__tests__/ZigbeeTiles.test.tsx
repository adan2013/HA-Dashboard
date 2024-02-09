import { render, screen } from '@testing-library/react'
import { BatteryTile, SignalTile } from '../ZigbeeTiles'
import { ZigbeeEntityState } from '../../../api/utils'
import { getZigbeeEntity } from '../../../utils/testUtils'

const testEntities: ZigbeeEntityState[] = [
  getZigbeeEntity('device1', 10, 100),
  getZigbeeEntity('device2', 45, 200),
  getZigbeeEntity('device3', 70, 140),
  getZigbeeEntity('device4', 15, 19),
  getZigbeeEntity('device5', 40, 50),
  getZigbeeEntity('device6', 100, 255)
]

jest.mock('../../../api/hooks', () => ({
  useHomeAssistantZigbeeEntities: () => testEntities
}))

describe('ZigbeeTiles', () => {
  it('should render list of zigbee devices with low battery level', () => {
    render(<BatteryTile />)
    expect(screen.getByText('Batteries')).toBeInTheDocument()
    expect(screen.getByTestId('device1_name-0')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(screen.getByTestId('device2_name-1')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByTestId('device3_name-2')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
    expect(screen.getByTestId('device4_name-3')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByTestId('device5_name-4')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('See more (1)')).toBeInTheDocument()
    expect(screen.getByTestId('device1_name-low-battery')).toBeInTheDocument()
    expect(screen.getByTestId('device4_name-low-battery')).toBeInTheDocument()
  })

  it('should render list of zigbee devices with low signal level', () => {
    render(<SignalTile />)
    expect(screen.getByText('Zigbee signals')).toBeInTheDocument()
    expect(screen.getByTestId('device1_name-0')).toBeInTheDocument()
    expect(screen.getByText('100 LQ')).toBeInTheDocument()
    expect(screen.getByTestId('device2_name-1')).toBeInTheDocument()
    expect(screen.getByText('200 LQ')).toBeInTheDocument()
    expect(screen.getByTestId('device3_name-2')).toBeInTheDocument()
    expect(screen.getByText('140 LQ')).toBeInTheDocument()
    expect(screen.getByTestId('device4_name-3')).toBeInTheDocument()
    expect(screen.getByText('19 LQ')).toBeInTheDocument()
    expect(screen.getByTestId('device5_name-4')).toBeInTheDocument()
    expect(screen.getByText('50 LQ')).toBeInTheDocument()
    expect(screen.getByText('See more (1)')).toBeInTheDocument()
    expect(screen.getByTestId('device4_name-low-signal')).toBeInTheDocument()
  })
})
