import { fireEvent, screen } from '@testing-library/react'
import { ZigbeeNetworkModalParams } from '../../../../contexts/modalUtils'
import { getZigbeeEntity, renderModalBody } from '../../../../utils/testUtils'
import ZigbeeNetworkBody from '../ZigbeeNetworkBody'
import { ZigbeeEntityState } from '../../../../api/utils'

const testEntities: ZigbeeEntityState[] = [
  getZigbeeEntity('device1', 10, 40),
  getZigbeeEntity('device2', 20, 50),
  getZigbeeEntity('device3', 30, 60)
]

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantZigbeeEntities: () => testEntities
}))

const renderZigbeeNetworkBody = (tab: ZigbeeNetworkModalParams['tab']) =>
  renderModalBody(<ZigbeeNetworkBody />, 'zigbeeNetwork', {
    tab
  })

type TestCase = [ZigbeeNetworkModalParams['tab'], string]

const testCases: TestCase[] = [
  ['all', 'All'],
  ['battery', 'Batteries'],
  ['signal', 'Signal quality']
]

describe('ZigbeeNetworkBody', () => {
  it.each(testCases)('should render "%s" tab', (tab, menuItemName) => {
    renderZigbeeNetworkBody(tab)
    expect(screen.getByText('Zigbee network')).toBeInTheDocument()
    expect(screen.getByText(menuItemName)).toHaveClass('bg-white text-black')
    expect(screen.getByText('device1')).toBeInTheDocument()
    expect(screen.getByText('device2')).toBeInTheDocument()
    expect(screen.getByText('device3')).toBeInTheDocument()
  })

  it('should switch between tabs', () => {
    renderZigbeeNetworkBody('all')
    const selectedTabClasses = 'bg-white text-black'
    const allTab = screen.getByText('All')
    const batteryTab = screen.getByText('Batteries')
    const signalTab = screen.getByText('Signal quality')
    expect(allTab).toHaveClass(selectedTabClasses)
    expect(batteryTab).not.toHaveClass(selectedTabClasses)
    expect(signalTab).not.toHaveClass(selectedTabClasses)
    fireEvent.click(batteryTab)
    expect(allTab).not.toHaveClass(selectedTabClasses)
    expect(batteryTab).toHaveClass(selectedTabClasses)
    expect(signalTab).not.toHaveClass(selectedTabClasses)
    fireEvent.click(signalTab)
    expect(allTab).not.toHaveClass(selectedTabClasses)
    expect(batteryTab).not.toHaveClass(selectedTabClasses)
    expect(signalTab).toHaveClass(selectedTabClasses)
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderZigbeeNetworkBody('all')
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
