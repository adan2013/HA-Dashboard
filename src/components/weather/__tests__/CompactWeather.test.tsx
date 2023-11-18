import { render, screen } from '@testing-library/react'
import CurrentWeather from '../compact/CurrentWeather'
import ShortForecast from '../compact/ShortForecast'
import LongForecast from '../compact/LongForecast'
import {
  currentWeatherMock,
  hourlyForecastMock,
  dailyForecastMock
} from '../../../api/backend/weatherMocks'

describe('Weather - compact version', () => {
  it('should render current weather', () => {
    render(<CurrentWeather data={currentWeatherMock} />)
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/01d@2x.png'
    )
    expect(screen.getByText('20°')).toBeInTheDocument()
    expect(screen.getByText('Feels like 19°')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('5 km/h')).toBeInTheDocument()
    expect(screen.getByText('UVI 1')).toBeInTheDocument()
    expect(screen.getByText('AQI 2')).toBeInTheDocument()
  })

  it('should render short hourly forecast', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))
    render(<ShortForecast data={hourlyForecastMock} />)
    expect(screen.getByText('23')).toBeInTheDocument()
    expect(screen.getByText('00')).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('23°')).toBeInTheDocument()
    expect(screen.getByText('27°')).toBeInTheDocument()
    expect(screen.getByText('3°')).toBeInTheDocument()
    expect(screen.getByText('(21°)')).toBeInTheDocument()
    expect(screen.getByText('(31°)')).toBeInTheDocument()
    expect(screen.getByText('(-2°)')).toBeInTheDocument()
    expect(screen.getAllByTestId('WaterDropIcon')).toHaveLength(1)
    expect(screen.getAllByTestId('AirIcon')).toHaveLength(2)
    const images = screen.getAllByRole('img')
    expect(images[0]).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/23d@2x.png'
    )
    expect(images[1]).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/01d@2x.png'
    )
    expect(images[2]).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/76d@2x.png'
    )
  })

  it('should limit count of hourly forecast', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))
    render(<ShortForecast data={hourlyForecastMock} limit={2} />)
    expect(screen.getByText('23')).toBeInTheDocument()
    expect(screen.getByText('00')).toBeInTheDocument()
    expect(screen.queryByText('01')).not.toBeInTheDocument()
  })

  it('should render sunrise and sunset items', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))
    render(
      <ShortForecast
        data={hourlyForecastMock}
        sunrise={new Date('2023-01-01T00:34:00').getTime()}
        sunset={new Date('2024-01-01T01:12:00').getTime()}
      />
    )
    expect(screen.getByText('00:34')).toBeInTheDocument()
    expect(screen.getByText('01:12')).toBeInTheDocument()
    expect(screen.getByText('Sunrise')).toBeInTheDocument()
    expect(screen.getByText('Sunset')).toBeInTheDocument()
    expect(screen.getByTestId('UploadIcon')).toBeInTheDocument()
    expect(screen.getByTestId('DownloadIcon')).toBeInTheDocument()
  })

  it('should render long daily forecast', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))
    render(<LongForecast data={dailyForecastMock} />)
    expect(screen.getByText('Sun 31')).toBeInTheDocument()
    expect(screen.getByText('Mon 01')).toBeInTheDocument()
    expect(screen.getByText('Tue 02')).toBeInTheDocument()
    expect(screen.getByText('23° / 24°')).toBeInTheDocument()
    expect(screen.getByText('22° / 16°')).toBeInTheDocument()
    expect(screen.getByText('4° / -2°')).toBeInTheDocument()
    expect(screen.getAllByTestId('WaterDropIcon')).toHaveLength(3)
    expect(screen.getAllByTestId('AirIcon')).toHaveLength(3)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })
})
