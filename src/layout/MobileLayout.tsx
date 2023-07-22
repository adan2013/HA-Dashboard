import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'

import { mobileMenu, pageMetadata } from './menus'
import { OutletContextType } from '../contexts/OutletContext'
import NotificationDot from '../components/layout/NotificationDot'
import { useBackground } from '../contexts/GlobalContext'

const MobileLayout = () => {
  const background = useBackground()
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
          background.type === 'color' && background.value,
          background.type === 'gradient' && background.value,
          background.type === 'image' && `bg-cover`,
          background.textColor
        )}
        style={
          background.type === 'image'
            ? { backgroundImage: `url('/backgrounds/${background.value}')` }
            : {}
        }
      >
        {pageTitle && (
          <div className="my-4 text-3xl font-bold">{pageTitle}</div>
        )}
        <Outlet context={context} />
      </div>
      <div className="fixed bottom-0 h-16 w-full border-t-2 border-blue-800 bg-gray-900">
        <div className="flex h-full flex-row">
          {mobileMenu.map(({ name, path, icon, notificationDot }) => (
            <div
              key={name}
              className={clsx(
                'w-1/4 transition-colors duration-500',
                (location.pathname === path ||
                  (path === '/' && !anythingIsSelected)) &&
                  'bg-blue-800'
              )}
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileLayout
