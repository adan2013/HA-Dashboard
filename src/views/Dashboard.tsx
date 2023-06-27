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
              <div className={clsx('')}>
                <div
                  className={clsx(
                    'relative aspect-square w-44 overflow-hidden rounded-lg border-2 border-transparent transition-colors duration-500 hover:border-white',
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
  }

  return <div>TODO desktop dashboard</div>
}

export default Dashboard
