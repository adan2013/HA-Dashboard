import { render, screen } from '@testing-library/react'
import { weatherServiceDataMock } from '../../../api/backend/weatherMocks'
import MobileWeatherDetails from '../mobile/MobileWeatherDetails'

jest.mock('../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: jest.fn()
  })
}))

jest.mock('recharts', () => {
  const originalModule = jest.requireActual('recharts')

  return {
    __esModule: true,
    ...originalModule,
    ResponsiveContainer: () => <div>CHART_COMPONENT</div>
  }
})

describe('Weather - mobile full version', () => {
  it('keeps the widget forecast first and only adds complementary tiles', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31T11:00:00Z'))

    render(<MobileWeatherDetails state={weatherServiceDataMock} />)

    expect(screen.getByText('20°')).toBeVisible()
    expect(screen.getByText('Feels like 19°')).toBeVisible()
    expect(screen.getByText('Additional details')).toBeVisible()
    expect(screen.getByText('Wind history')).toBeVisible()
    expect(screen.getByText('Visibility')).toBeVisible()
    expect(screen.getByText('Rain radar')).toBeVisible()
    expect(screen.queryByText('UV index')).not.toBeInTheDocument()
    expect(screen.queryByText('Air quality index')).not.toBeInTheDocument()

    jest.useRealTimers()
  })
})
