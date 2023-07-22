import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { cloneElement, useEffect, useState } from 'react'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { sectionTiles } from '../layout/menus'
import { useLayoutContext } from '../contexts/OutletContext'
import Weather from './Weather'
import Notifications from './Notifications'
import { useTheme } from '../contexts/GlobalContext'

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
  const h = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
  const m = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
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

  return (
    <>
      <div className="text-7xl">{getTime(now)}</div>
      <div className="flex flex-col justify-center">
        <div className="text-xl">{getDay(now)}</div>
        <div className="text-xl">{getDate(now)}</div>
      </div>
    </>
  )
}

const Dashboard = () => {
  const layout = useLayoutContext()
  const theme = useTheme()

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
          'col-span-2 flex h-24 flex-row gap-4 border-b-2 p-3',
          theme.border
        )}
      >
        <TimeAndDate />
        <div className="absolute right-5 top-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-transparent transition-colors hover:border-gray-500">
          <Link to="/customization">
            <MoreHorizOutlinedIcon className="!text-[2rem]" />
          </Link>
        </div>
      </div>
      <div className="h-[calc(100vh-20rem)] p-3">
        <Weather />
      </div>
      <div className={clsx('border-l-2 p-3', theme.border)}>
        <Notifications />
      </div>
    </div>
  )
}

export default Dashboard
