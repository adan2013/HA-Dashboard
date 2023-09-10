import axios from 'axios'
import { fireEvent, screen } from '@testing-library/react'
import { HistoryChartModalParams } from '../../../../contexts/modalUtils'
import {
  generateEntityHistory,
  renderModalBody
} from '../../../../utils/testUtils'
import HistoryChartBody from '../HistoryChartBody'

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: 200,
      data: generateEntityHistory([10, 20, 30])
    })
  )
}))

const testParams: HistoryChartModalParams = {
  title: 'chart-title',
  entityName: 'entityName',
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

const endDate = '2023-09-04T15:09:36.456Z'
const correctHeaders = {
  'Content-Type': 'application/json',
  authorization: 'Bearer ACCESS_TOKEN'
}

describe('HistoryChartBody', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(endDate))
  })

  it('should fetch 24h historical data and display title with threshold', () => {
    renderHistoryChartBody()
    expect(axios.get).toHaveBeenCalledWith(
      `http://127.0.0.1:8123/api/history/period?filter_entity_id=entityId&no_attributes&end_time=${endDate}`,
      { headers: correctHeaders }
    )
    expect(screen.getByText('chart-title')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Zoom out')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Zoom in')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Refresh')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Close')).toBeInTheDocument()
  })

  it('should switch between zoom levels and fetch correct historical data', () => {
    renderHistoryChartBody()
    const firstLevelStartDate = '2023-08-30T15:09:36.456Z'
    const lastLevelStartDate = '2023-09-04T09:09:36.456Z'
    const zoomOutButton = screen.getByTestId('modal-button-Zoom out')
    const zoomInButton = screen.getByTestId('modal-button-Zoom in')

    fireEvent.click(zoomInButton)
    expect(axios.get).toHaveBeenLastCalledWith(
      `http://127.0.0.1:8123/api/history/period/${lastLevelStartDate}?filter_entity_id=entityId&no_attributes&end_time=${endDate}`,
      { headers: correctHeaders }
    )

    expect(zoomOutButton).not.toHaveClass('text-gray-600')
    expect(zoomInButton).toHaveClass('text-gray-600')

    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    fireEvent.click(zoomOutButton)
    expect(axios.get).toHaveBeenLastCalledWith(
      `http://127.0.0.1:8123/api/history/period/${firstLevelStartDate}?filter_entity_id=entityId&no_attributes&end_time=${endDate}`,
      { headers: correctHeaders }
    )

    expect(zoomOutButton).toHaveClass('text-gray-600')
    expect(zoomInButton).not.toHaveClass('text-gray-600')
  })

  it('should reload the data after clicking the refresh button', () => {
    renderHistoryChartBody()
    expect(axios.get).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByTestId('modal-button-Refresh'))
    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderHistoryChartBody()
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
