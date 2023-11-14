import NightsStayIcon from '@mui/icons-material/NightsStay'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { WeatherServiceData } from '../api/backend/weatherTypes'
import { useBackend } from '../contexts/BackendContext'
import ShortForecast from '../components/weather/compact/ShortForecast'
import LongForecast from '../components/weather/compact/LongForecast'
import CurrentWeather from '../components/weather/compact/CurrentWeather'
import Tile from '../components/basic/Tile'
import { useLayoutContext } from '../contexts/OutletContext'

const chartData = [
  { name: 'Group A', value: 25 },
  { name: 'Group B', value: 25 },
  { name: 'Group C', value: 25 },
  { name: 'Group D', value: 25 },
  { name: 'Group E', value: 25 }
]
const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#a855f7']

const ChartBody = () => (
  <div className="absolute left-0 top-5 h-full w-full">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          animationDuration={0}
          data={chartData}
          startAngle={215}
          endAngle={-35}
          innerRadius={55}
          outerRadius={70}
          fill="#8884d8"
          paddingAngle={8}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} strokeWidth={0} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
)

const Divider = () => <div className="mx-1 border-b-[1px] border-gray-400" />

type WeatherViewProps = {
  isWidget?: boolean
}

const Weather = ({ isWidget }: WeatherViewProps) => {
  const [state, setState] = useState<WeatherServiceData>(null)
  const backend = useBackend()
  const navigate = useNavigate()
  const { isMobile } = useLayoutContext()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.weather) {
          setState(data.weather)
        }
      }),
    [backend]
  )

  if (!state) {
    return (
      <div className="text-md mt-20 text-center font-extrabold text-gray-500">
        <div className="mb-2">
          <NightsStayIcon className="!text-8xl" />
        </div>
        NO FORECAST AVAILABLE
      </div>
    )
  }

  if (isWidget || isMobile) {
    return (
      <div
        className={clsx('flex flex-col gap-2', isWidget && 'cursor-pointer')}
        onClick={isWidget ? () => navigate('/weather') : undefined}
      >
        <CurrentWeather data={state.current} />
        <Divider />
        <ShortForecast
          data={state.shortForecast}
          limit={18}
          sunrise={state.current.sunrise}
          sunset={state.current.sunset}
        />
        <Divider />
        <LongForecast data={state.longForecast} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mx-6">
        <div className="grid grid-cols-5 gap-4">
          <Tile title="Current" size="horizontal" />
          <Tile title="Temp. history" />
          <Tile title="UV" customBody={<ChartBody />} />
          <Tile title="Air quality" customBody={<ChartBody />} />
          <Tile title="Wind history" />
          <Tile title="Wind" size="horizontal" customBody={<ChartBody />} />
          <Tile title="Rain radar" size="big" />
          <Tile title="Storm radar" size="big" />
          <Tile title="Humidity" customBody={<ChartBody />} />
          <Tile title="Sun" />
          <Tile title="Pressure" size="horizontal" customBody={<ChartBody />} />
        </div>
        <div className="my-4 h-40 rounded-lg bg-blue-900 p-5 text-center">
          SHORT FORECAST
        </div>
        <div className="my-4 h-64 rounded-lg bg-blue-900 p-5 text-center">
          LONG FORECAST
        </div>
      </div>
    </div>
  )
}

export default Weather
