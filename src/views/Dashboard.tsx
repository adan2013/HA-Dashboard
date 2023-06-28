import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { cloneElement } from 'react'
import { sectionTiles } from '../layout/menus'
import { useLayoutContext } from '../contexts/OutletContext'

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
    <div className="grid grid-cols-2">
      <div className="col-span-2 flex h-24 flex-row gap-4 border-b-2 border-gray-500 p-1">
        <div className="text-7xl">12:00</div>
        <div className="flex flex-col text-gray-200">
          <div className="text-xl">Monday</div>
          <div className="text-xl">01 Jan 2023</div>
        </div>
      </div>
      <div className="p-3">
        <h2>Weather</h2>
      </div>
      <div className="border-l-2 border-gray-500 p-3">
        <h2>Notifications</h2>
      </div>
    </div>
  )
}

export default Dashboard
