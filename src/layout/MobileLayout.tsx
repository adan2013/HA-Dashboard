import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'

import { mobileMenu, pageMetadata } from './menus'
import { OutletContextType } from './outletContext'

export default () => {
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
      <div className="min-h-screen overflow-x-hidden bg-gray-800 p-4 pb-32">
        {pageTitle && (
          <div className="my-6 text-5xl font-bold">{pageTitle}</div>
        )}
        <Outlet context={context} />
      </div>
      <div className="fixed bottom-0 h-20 w-full border-t-2 border-blue-800 bg-gray-900">
        <div className="flex h-full flex-row">
          {mobileMenu.map(({ name, path, icon }) => (
            <div
              key={name}
              className={clsx(
                'w-1/3 transition-colors duration-500',
                (location.pathname === path ||
                  (path === '/' && !anythingIsSelected)) &&
                  'bg-blue-800'
              )}
            >
              <Link to={path}>
                <div className="flex h-full cursor-pointer flex-col items-center justify-center">
                  <div>{icon}</div>
                  <div className="pt-1 text-sm">{name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
