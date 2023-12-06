import { fireEvent, render, screen } from '@testing-library/react'
import CurrentWeatherTile from '../full/CurrentWeatherTile'
import TemperatureHistoryTile from '../full/TemperatureHistoryTile'
import {
  currentWeatherMock,
  dailyForecastMock,
  hourlyForecastMock
} from '../../../api/backend/weatherMocks'
import UvIndexTile from '../full/UvIndexTile'
import AirQualityIndexTile from '../full/AirQualityIndexTile'
import WindDirectionTile from '../full/WindDirectionTile'
import WindTile from '../full/WindTile'
import WindGustTile from '../full/WindGustTile'
import DewPointTile from '../full/DewPointTile'
import HumidityTile from '../full/HumidityTile'
import PressureTile from '../full/PressureTile'
import SunTile from '../full/SunTile'
import CloudsTile from '../full/CloudsTile'
import VisibilityTile from '../full/VisibilityTile'
import TableForecastView, {
  longForecastParams,
  shortForecastParams
} from '../full/TableForecastView'
import { addLeadingZero } from '../../../utils/numberUtils'
import { getDayOfWeekName } from '../utils'
import RainRadarTile from '../full/RainRadarTile'

const openModalMock = jest.fn()

jest.mock('../../../contexts/ModalContext', () => ({
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
    ResponsiveContainer: () => <div>CHART_COMPONENT</div>
  }
})

describe('Weather - full version', () => {
  it('should display current weather tile', () => {
    render(<CurrentWeatherTile current={currentWeatherMock} />)
    expect(screen.getByText('20°')).toBeVisible()
    expect(screen.getByText('Feels like 19°')).toBeVisible()
    expect(screen.getByText('Sun')).toBeVisible()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/01d@2x.png'
    )
  })

  it('should display temperature history tile', () => {
    render(<TemperatureHistoryTile history={[4, 6, 5, 3, 12]} />)
    expect(screen.getByText('Temp. history')).toBeVisible()
    expect(screen.getByText('MIN')).toBeVisible()
    expect(screen.getByText('MAX')).toBeVisible()
    expect(screen.getByText('3')).toBeVisible()
    expect(screen.getByText('12')).toBeVisible()
    expect(screen.getByText('CHART_COMPONENT')).toBeVisible()
  })

  it('should display UV index tile', () => {
    render(<UvIndexTile value={currentWeatherMock.uvi} />)
    expect(screen.getByText('UV index')).toBeVisible()
    expect(screen.getByText('CHART_COMPONENT')).toBeVisible()
    expect(screen.getByText('1')).toBeVisible()
    expect(screen.getByText('Moderate')).toBeVisible()
  })

  it('should display air quality index tile', () => {
    render(<AirQualityIndexTile value={currentWeatherMock.aqi} />)
    expect(screen.getByText('Air quality index')).toBeVisible()
    expect(screen.getByText('CHART_COMPONENT')).toBeVisible()
    expect(screen.getByText('2')).toBeVisible()
    expect(screen.getByText('Fair')).toBeVisible()
  })

  it('should display wind direction tile', () => {
    render(<WindDirectionTile windDirection={currentWeatherMock.windDeg} />)
    expect(screen.getByText('Wind direction')).toBeVisible()
    expect(screen.getByText('N')).toBeVisible()
    expect(screen.getByTestId('wind-direction-arrow')).toHaveStyle(
      'transform: rotate(90deg)'
    )
  })

  it('should display wind tile', () => {
    render(
      <WindTile
        windSpeed={currentWeatherMock.windSpeed}
        history={[15, 20, 0, 17]}
      />
    )
    expect(screen.getByText('Wind')).toBeVisible()
    expect(screen.getAllByText('CHART_COMPONENT')).toHaveLength(2)
    expect(screen.getByText('5')).toBeVisible()
    expect(screen.getByText('km/h')).toBeVisible()
    expect(screen.getByText('MIN')).toBeVisible()
    expect(screen.getByText('MAX')).toBeVisible()
    expect(screen.getByText('0')).toBeVisible()
    expect(screen.getByText('20')).toBeVisible()
  })

  it('should display wind gust tile', () => {
    render(<WindGustTile value={currentWeatherMock.windGust} />)
    expect(screen.getByText('Wind gust')).toBeVisible()
    expect(screen.getByText('CHART_COMPONENT')).toBeVisible()
    expect(screen.getByText('7')).toBeVisible()
    expect(screen.getByText('km/h')).toBeVisible()
  })

  it('should display -- if the wind gust value is undefined', () => {
    render(<WindGustTile value={undefined} />)
    expect(screen.getByText('Wind gust')).toBeVisible()
    expect(screen.getByText('CHART_COMPONENT')).toBeVisible()
    expect(screen.getByText('--')).toBeVisible()
    expect(screen.getByText('km/h')).toBeVisible()
  })

  it('should display dew point tile', () => {
    render(<DewPointTile value={currentWeatherMock.dewPoint} />)
    expect(screen.getByText('Dew point')).toBeVisible()
    expect(screen.getByText('2°')).toBeVisible()
  })

  it('should display humidity tile', () => {
    render(<HumidityTile value={currentWeatherMock.humidity} />)
    expect(screen.getByText('Humidity')).toBeVisible()
    expect(screen.getByText('CHART_COMPONENT')).toBeVisible()
    expect(screen.getByText('80')).toBeVisible()
    expect(screen.getByText('%')).toBeVisible()
  })

  it('should display pressure tile', () => {
    render(
      <PressureTile
        current={currentWeatherMock.pressure}
        history={[999, 1030, 989, 1001]}
      />
    )
    expect(screen.getByText('Pressure')).toBeVisible()
    expect(screen.getAllByText('CHART_COMPONENT')).toHaveLength(2)
    expect(screen.getByText('1012')).toBeVisible()
    expect(screen.getByText('hPa')).toBeVisible()
    expect(screen.getByText('MIN')).toBeVisible()
    expect(screen.getByText('MAX')).toBeVisible()
    expect(screen.getByText('989')).toBeVisible()
    expect(screen.getByText('1030')).toBeVisible()
  })

  it('should display sun tile with the correct progress indicator', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31T11:00:00Z'))
    render(
      <SunTile
        sunrise={currentWeatherMock.sunrise}
        sunset={currentWeatherMock.sunset}
      />
    )
    expect(screen.getByText('Sun position')).toBeVisible()
    expect(screen.getByText('9:53')).toBeVisible()
    expect(screen.getByText('14:07')).toBeVisible()
    expect(screen.getByTestId('sun-progress-indicator')).toHaveStyle(
      'right: 74%'
    )
  })

  it('should display sun tile with invisible progress indicator at night', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31T22:00:00Z'))
    render(
      <SunTile
        sunrise={currentWeatherMock.sunrise}
        sunset={currentWeatherMock.sunset}
      />
    )
    expect(screen.getByTestId('sun-progress-indicator')).toHaveStyle(
      'right: 100%'
    )
  })

  it('should display clouds tile', () => {
    render(<CloudsTile value={currentWeatherMock.clouds} />)
    expect(screen.getByText('Clouds')).toBeVisible()
    expect(screen.getByText('48')).toBeVisible()
    expect(screen.getByText('%')).toBeVisible()
  })

  it('should display visibility tile', () => {
    render(<VisibilityTile value={currentWeatherMock.visibility} />)
    expect(screen.getByText('Visibility')).toBeVisible()
    expect(screen.getByText('9.5')).toBeVisible()
    expect(screen.getByText('km')).toBeVisible()
    expect(screen.getByText('95%')).toBeVisible()
  })

  it('should display table view for short forecast', () => {
    render(
      <TableForecastView
        data={hourlyForecastMock}
        params={shortForecastParams}
        headerRenderer={date =>
          `${addLeadingZero(date.getHours())}:${addLeadingZero(
            date.getMinutes()
          )}`
        }
        limit={24}
      />
    )
    Object.keys(shortForecastParams).forEach(key => {
      expect(screen.getByText(key)).toBeVisible()
    })
    expect(screen.getByText('23:00')).toBeVisible()
    expect(screen.getByText('00:00')).toBeVisible()
    expect(screen.getByText('01:00')).toBeVisible()
  })

  it('should display table view for long forecast', () => {
    render(
      <TableForecastView
        data={dailyForecastMock}
        params={longForecastParams}
        headerRenderer={date =>
          `${getDayOfWeekName(date)} ${addLeadingZero(date.getDate())}`
        }
      />
    )
    Object.keys(longForecastParams).forEach(key => {
      expect(screen.getByText(key)).toBeVisible()
    })
    expect(screen.getByText('Sun 31')).toBeVisible()
    expect(screen.getByText('Mon 01')).toBeVisible()
    expect(screen.getByText('Tue 02')).toBeVisible()
  })

  it('should display rain radar tile', () => {
    render(<RainRadarTile openModalOnClick />)
    expect(screen.getByText('Rain radar')).toBeVisible()
    fireEvent.mouseDown(screen.getByText('Rain radar'))
    fireEvent.mouseUp(screen.getByText('Rain radar'))
    expect(openModalMock).toHaveBeenCalledTimes(1)
    expect(openModalMock).toHaveBeenCalledWith('weather', {
      content: 'rain'
    })
  })
})
