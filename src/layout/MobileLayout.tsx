import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'
import { mobileMenu, pageMetadata } from './menus'
import { OutletContextType } from '../contexts/OutletContext'
import NotificationDot from '../components/layout/NotificationDot'

const MobileLayout = () => {
  const location = useLocation()
  const pageTitle = pageMetadata.find(
    page => page.path === location.pathname
  )?.title
  const context: OutletContextType = {
    isMobile: true
  }
  const anythingIsSelected = mobileMenu.some(
    ({ path }) => path === location.pathname
  )

  return (
    <div className="text-white">
      <div
        className={clsx(
          'min-h-screen overflow-x-hidden p-4 pb-24',
          'bg-black text-white'
        )}
      >
        {pageTitle && (
          <div className="my-4 text-3xl font-bold">{pageTitle}</div>
        )}
        <Outlet context={context} />
      </div>
      <div className="fixed bottom-0 z-20 h-16 w-full border-t-2 border-blue-800 bg-gray-900">
        <div className="flex h-full flex-row">
          {mobileMenu.map(({ name, path, icon, notificationDot }) => {
            const isHighlighted =
              location.pathname === path ||
              (path === '/' && !anythingIsSelected)
            return (
              <div
                key={name}
                className={clsx(
                  'w-1/4 transition-colors duration-500',
                  isHighlighted && 'bg-blue-800'
                )}
                data-testid={`section-${name}${
                  isHighlighted ? '-highlighted' : ''
                }`}
              >
                <Link to={path}>
                  <div className="flex h-full cursor-pointer flex-col items-center justify-center">
                    <div className="relative px-1">
                      {notificationDot && <NotificationDot />}
                      {icon}
                    </div>
                    <div className="pt-2 text-xs">{name}</div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileLayout
