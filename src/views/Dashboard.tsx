import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { cloneElement } from 'react'

import { dashboardTiles } from '../layout/menus'

const Dashboard = () => (
  <div className="flex flex-row flex-wrap justify-center gap-5">
    {dashboardTiles.map(
      ({ name, path, background, iconColor, iconClass, icon }) => (
        <Link key={name} to={path}>
          <div className={clsx('')}>
            <div
              className={clsx(
                'relative aspect-square w-44 overflow-hidden rounded-lg shadow-[inset_0_0_4px_rgba(0,0,0,0.6)]',
                background
              )}
            >
              <div
                className={clsx(
                  'absolute left-0 top-0 flex aspect-square w-44 items-center justify-center',
                  iconColor
                )}
              >
                {cloneElement(icon, {
                  className: clsx('!text-[8rem]', iconClass)
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

export default Dashboard
