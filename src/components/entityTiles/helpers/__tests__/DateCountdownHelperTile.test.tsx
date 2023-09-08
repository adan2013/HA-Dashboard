import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ToastContainer } from 'react-toastify'
import DateCountdownHelperTile, {
  DateCountdownHelperTileProps
} from '../DateCountdownHelperTile'
import { getMockedEntityState, holdTest } from '../../../../utils/testUtils'

const openModalMock = jest.fn()

jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

jest.mock('recharts', () => {
  const originalModule = jest.requireActual('recharts')

  return {
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line react/prop-types
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    PieChart: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    Pie: ({ data }) => (
      <div>
        {data.map(item => (
          <div key={item.fill}>{`PIE_DATA_${item.fill}_${item.value}`}</div>
        ))}
      </div>
    )
  }
})

// jest.mock('../../../../api/hooks', () => {
//   const originalModule = jest.requireActual('../../../../api/hooks')
//
//   return {
//     __esModule: true,
//     ...originalModule,
//     useHomeAssistantEntity: jest.fn(() =>
//       getMockedEntityState('entityName', '2023-04-01')
//     )
//   }
// })

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: jest.fn(() =>
    getMockedEntityState('entityName', '2023-04-01')
  )
}))

const testProps: DateCountdownHelperTileProps = {
  title: 'title',
  entityName: 'entityName',
  interval: 120,
  warningThreshold: 50,
  criticalThreshold: 10
}

describe('DateCountdownHelperTile', () => {
  it('should show a toast when the tile is clicked', async () => {
    render(
      <>
        <DateCountdownHelperTile {...testProps} />
        <ToastContainer />
      </>
    )
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(
        screen.getByText('Hold the tile to reset the countdown value')
      ).toBeVisible()
    )
  })

  it('should reset the countdown when the tile is held', async () => {
    render(<DateCountdownHelperTile {...testProps} />)
    fireEvent.mouseDown(screen.getByText('title'))
    await holdTest(1100)
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() => expect(openModalMock).toHaveBeenCalledTimes(1))
  })

  it.each([
    [100, 120, '#16a34a', '2023-04-01'],
    [92, 110, '#16a34a', '2023-04-11'],
    [67, 80, '#16a34a', '2023-05-11'],
    [41, 49, '#ea580c', '2023-06-11'],
    [25, 30, '#ea580c', '2023-06-30'],
    [9, 10, '#dc2626', '2023-07-20'],
    [0, 0, '#dc2626', '2023-07-30'],
    [0, -31, '#dc2626', '2023-08-30']
  ])(
    'should render DateCountdownHelperTile with %i percent of durability and %i days left',
    (durability, daysLeft, color, currentDate) => {
      jest.useFakeTimers().setSystemTime(new Date(currentDate))
      render(<DateCountdownHelperTile {...testProps} />)
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText(`${daysLeft} days left`)).toBeInTheDocument()
      expect(screen.getByText('30-7-2023')).toBeInTheDocument()
      expect(screen.getByTestId('durability-percent')).toHaveTextContent(
        durability.toString()
      )
      expect(
        screen.getByText(`PIE_DATA_${color}_${durability}`)
      ).toBeInTheDocument()
    }
  )
})
