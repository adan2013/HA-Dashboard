import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'
import { cloneElement } from 'react'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { pageMetadata, sectionTiles } from './menus'
import { OutletContextType } from '../contexts/OutletContext'
import NotificationDot from '../components/layout/NotificationDot'

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
      <div
        className={clsx(
          'min-h-screen overflow-hidden p-4 lg:p-0 lg:pb-24',
          'bg-black text-white'
        )}
      >
        {pageTitle && collapsed && (
          <div className="my-6 text-3xl font-bold lg:pl-5">{pageTitle}</div>
        )}
        <Outlet context={context} />
      </div>
      <div
        className={clsx(
          'fixed bottom-0 z-20 w-full border-t-2 border-blue-600 bg-gray-900 transition-all duration-500',
          collapsed ? 'h-20' : 'h-56'
        )}
      >
        {collapsed && (
          <div
            className="fixed bottom-5 left-5 text-gray-300"
            data-testid="back-button"
          >
            <Link to="/">
              <ArrowBackOutlinedIcon className="!text-4xl" />
            </Link>
          </div>
        )}
        <div
          className={clsx(
            'mx-auto flex h-full flex-row justify-between gap-5',
            collapsed ? 'max-w-lg p-3' : 'max-w-6xl p-5'
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
                    collapsed ? 'w-14' : 'w-36'
                  )}
                >
                  <div className={clsx('aspect-square', tile.iconColor)}>
                    {cloneElement(tile.icon, {
                      className: clsx(
                        collapsed ? '!text-[2rem]' : '!text-[7rem]',
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
          <div
            className="fixed bottom-5 right-5 text-gray-300"
            data-testid="notification-button"
          >
            <Link to="/notifications">
              <NotificationDot />
              <NotificationsNoneOutlinedIcon className="!text-4xl" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DesktopLayout
