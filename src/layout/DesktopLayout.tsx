import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'
import { cloneElement } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { pageMetadata, sectionTiles } from './menus'
import { OutletContextType } from '../contexts/OutletContext'

const DesktopLayout = () => {
  const location = useLocation()
  const pageTitle = pageMetadata.find(
    page => page.path === location.pathname
  )?.title
  const context: OutletContextType = {
    isMobile: false
  }
  const collapsed = location.pathname !== '/'

  return (
    <div className="text-white">
      <div className="min-h-screen overflow-x-hidden bg-gray-800 p-4">
        {pageTitle && collapsed && (
          <div className="my-6 text-3xl font-bold">{pageTitle}</div>
        )}
        <Outlet context={context} />
      </div>
      <div
        className={clsx(
          'fixed bottom-0 w-full border-t-2 border-blue-800 bg-gray-900 transition-all duration-500',
          collapsed ? 'h-24' : 'h-56'
        )}
      >
        {collapsed && (
          <div className="fixed bottom-4 left-4 text-gray-300">
            <Link to="/">
              <HomeOutlinedIcon className="!text-6xl" />
            </Link>
          </div>
        )}
        <div
          className={clsx(
            'mx-auto flex h-full flex-row justify-between gap-5',
            collapsed ? 'max-w-xl p-3' : 'max-w-7xl p-5'
          )}
        >
          {sectionTiles.map(tile => (
            <Link key={tile.name} to={tile.path}>
              <div>
                <div
                  className={clsx(
                    'relative flex aspect-square items-center justify-center rounded-lg border-4 border-transparent hover:border-white',
                    tile.background,
                    tile.path === location.pathname && 'border-white',
                    collapsed ? 'w-16' : 'w-36'
                  )}
                >
                  <div className={clsx('aspect-square', tile.iconColor)}>
                    {cloneElement(tile.icon, {
                      className: clsx(
                        collapsed ? '!text-[3rem]' : '!text-[7rem]',
                        tile.iconClass
                      )
                    })}
                  </div>
                </div>
                {!collapsed && (
                  <div className="mt-2 text-center">{tile.name}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
        {collapsed && (
          <div className="fixed bottom-4 right-4 text-gray-300">
            <Link to="/notifications">
              <NotificationsNoneOutlinedIcon className="!text-6xl" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DesktopLayout
