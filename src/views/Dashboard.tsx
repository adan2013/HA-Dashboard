import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { cloneElement, useEffect, useState } from 'react'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { sectionTiles } from '../layout/menus'
import { useLayoutContext } from '../contexts/OutletContext'
import Weather from './Weather'
import Notifications from './Notifications'
import { addLeadingZero } from '../utils/numberUtils'

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const getTime = (now: Date) => {
  const h = addLeadingZero(now.getHours())
  const m = addLeadingZero(now.getMinutes())
  return `${h}:${m}`
}

const getDay = (now: Date) => dayNames[now.getDay()]

const getDate = (now: Date) => {
  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()
  const month = monthNames[now.getMonth()]
  const year = now.getFullYear()
  return `${day} ${month} ${year}`
}

const TimeAndDate = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const time = getTime(now)
  const day = getDay(now)
  const date = getDate(now)

  return (
    <div className="mt-1 flex flex-row items-center gap-3">
      <div className="text-4xl font-bold">{time}</div>
      <div className="text-2xl font-light">{`${day} ${date}`}</div>
    </div>
  )
}

const Dashboard = () => {
  const layout = useLayoutContext()

  if (layout?.isMobile) {
    return (
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {sectionTiles.map(
          ({ name, path, background, iconColor, iconClass, icon }) => (
            <Link key={name} to={path}>
              <div>
                <div
                  className={clsx(
                    'flex aspect-square w-36 items-center justify-center overflow-hidden rounded-lg border-2 border-transparent transition-colors duration-500 hover:border-white',
                    background
                  )}
                >
                  <div className={clsx('aspect-square', iconColor)}>
                    {cloneElement(icon, {
                      className: clsx('!text-[6rem]', iconClass)
                    })}
                  </div>
                </div>
                <div className="mt-2 text-center">{name}</div>
              </div>
            </Link>
          )
        )}
      </div>
    )
  }

  return (
    <div className="relative grid grid-cols-2">
      <div
        className={clsx(
          'col-span-2 flex h-20 flex-row justify-center gap-4 border-b-2 border-blue-600 p-3'
        )}
      >
        <TimeAndDate />
        <div className="absolute right-5 top-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-transparent transition-colors hover:border-gray-500">
          <Link to="/more">
            <MoreHorizOutlinedIcon className="!text-[2rem]" />
          </Link>
        </div>
      </div>
      <div className="h-[calc(100vh-19rem)] overflow-auto p-3">
        <Weather isWidget />
      </div>
      <div className="h-[calc(100vh-19rem)] overflow-auto border-l-2 border-blue-600 p-3">
        <Notifications isWidget />
      </div>
    </div>
  )
}

export default Dashboard
