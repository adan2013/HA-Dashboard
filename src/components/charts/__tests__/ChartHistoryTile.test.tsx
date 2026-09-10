import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ChartHistoryTile, { ChartHistoryTileProps } from '../ChartHistoryTile'
import { generateEntityHistory } from '../../../utils/testUtils'

// eslint-disable-next-line react/display-name
jest.mock('../../charts/BackgroundHistoryChart', () => () => (
  <div>BACKGROUND_CHART</div>
))

const openModalMock = jest.fn()
jest.mock('../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

const getSensorHistory = jest.fn(() =>
  Promise.resolve(generateEntityHistory([24.98, 26, 22]))
)
const backend = { getSensorHistory }
jest.mock('../../../contexts/BackendContext', () => ({
  useBackend: () => backend
}))

jest.mock('../../../api/hooks', () => ({
  useHomeAssistantEntity: () => ({
    entityState: {
      id: 'entityId',
      state: '24.98',
      lastChanged: '12345',
      lastUpdated: '12345',
      attributes: {
        friendly_name: 'entityName'
      }
    },
    isUnavailable: false
  })
}))

const renderTile = (customProps: Partial<ChartHistoryTileProps> = {}) =>
  render(
    <ChartHistoryTile
      title="TILE"
      entityId="entityName"
      showDecimals={0}
      unit="%"
      {...customProps}
    />
  )

describe('ChartHistoryTile', () => {
  it('should render chart history tile in standard configuration', async () => {
    renderTile()
    expect(screen.getByLabelText('Loading TILE')).toHaveAttribute(
      'aria-busy',
      'true'
    )
    await screen.findByText('TILE')
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText('BACKGROUND_CHART')).toBeInTheDocument()
    )
    expect(screen.getByText('22 / 26')).toBeInTheDocument()
  })

  it('should render chart history tile without chart', async () => {
    renderTile({
      hideChart: true,
      showDecimals: 1
    })
    expect(screen.getByLabelText('Loading TILE')).toHaveAttribute(
      'aria-busy',
      'true'
    )
    await screen.findByText('TILE')
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText('22.0 / 26.0')).toBeInTheDocument()
    )
    expect(screen.queryByText('BACKGROUND_CHART')).not.toBeInTheDocument()
  })

  it('should hide and show min/max values', async () => {
    renderTile({
      hideMinMax: true
    })
    await waitFor(() =>
      expect(screen.getByText('BACKGROUND_CHART')).toBeInTheDocument()
    )
    expect(screen.queryByText('22 / 26')).not.toBeInTheDocument()
    renderTile()
    await waitFor(() => expect(screen.getByText('22 / 26')).toBeInTheDocument())
  })

  it('should display the correct decimal value', async () => {
    renderTile()
    expect(screen.queryByTestId('decimal-value')).not.toBeInTheDocument()
    renderTile({ showDecimals: 1 })
    expect(await screen.findByText('.9')).toBeInTheDocument()
    renderTile({ showDecimals: 2 })
    expect(await screen.findByText('.98')).toBeInTheDocument()
  })

  it('should pass custom props to tile component', async () => {
    renderTile({
      customTileProps: {
        isUnavailable: true
      }
    })
    expect(await screen.findByTestId('unavailable-tile')).toBeInTheDocument()
  })

  it('should not open history modal when disableModalHistory is true', async () => {
    renderTile({
      disableModalHistory: true
    })
    fireEvent.click(await screen.findByText('TILE'))
    expect(openModalMock).not.toHaveBeenCalled()
  })

  it('should open history modal after clicking the tile', async () => {
    renderTile()
    fireEvent.click(await screen.findByText('TILE'))
    expect(openModalMock).toHaveBeenCalledTimes(1)
  })
})
