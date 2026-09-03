import { fireEvent, screen } from '@testing-library/react'
import { HistoryChartModalParams } from '../../../../contexts/modalUtils'
import {
  generateEntityHistory,
  renderModalBody
} from '../../../../utils/testUtils'
import HistoryChartBody from '../HistoryChartBody'

const getSensorHistory = jest.fn(() =>
  Promise.resolve(generateEntityHistory([10, 20, 30]))
)
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: () => ({ getSensorHistory })
}))

const testParams: HistoryChartModalParams = {
  title: 'chart-title',
  entityId: 'entityId',
  graphValueThresholds: [
    {
      label: 'threshold-label',
      value: 100,
      color: 'red'
    }
  ]
}

const renderHistoryChartBody = (params: HistoryChartModalParams = testParams) =>
  renderModalBody(<HistoryChartBody />, 'historyChart', params)

describe('HistoryChartBody', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date('2023-09-04T15:09:36.456Z'))
  })

  it('should fetch 24h historical data and display title with threshold', () => {
    renderHistoryChartBody()
    expect(getSensorHistory).toHaveBeenCalledWith('entityId', 0)
    expect(screen.getByText('chart-title')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Zoom out')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Zoom in')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Refresh')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Close')).toBeInTheDocument()
  })

  it('should switch between zoom levels and fetch correct historical data', () => {
    renderHistoryChartBody()
    const zoomOutButton = screen.getByTestId('modal-button-Zoom out')
    const zoomInButton = screen.getByTestId('modal-button-Zoom in')

    fireEvent.click(zoomInButton)
    expect(getSensorHistory).toHaveBeenLastCalledWith('entityId', 360)

    expect(zoomOutButton).not.toHaveClass('text-gray-600')
    expect(zoomInButton).toHaveClass('text-gray-600')

    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    expect(getSensorHistory).toHaveBeenLastCalledWith('entityId', 7200)

    expect(zoomOutButton).toHaveClass('text-gray-600')
    expect(zoomInButton).not.toHaveClass('text-gray-600')
  })

  it('should reload the data after clicking the refresh button', () => {
    renderHistoryChartBody()
    expect(getSensorHistory).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByTestId('modal-button-Refresh'))
    expect(getSensorHistory).toHaveBeenCalledTimes(2)
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderHistoryChartBody()
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
