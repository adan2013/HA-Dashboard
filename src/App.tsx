import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import Notifications from './views/Notifications'
import Weather from './views/Weather'
import Error404 from './views/Error404'
import Layout from './layout/Layout'
import SectionDrawer from './views/SectionDrawer'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/weather',
        element: <Weather />
      },
      {
        path: '/notifications',
        element: <Notifications />
      },
      {
        path: '/section/:sectionId',
        element: <SectionDrawer />
      },
      {
        path: '*',
        element: <Error404 />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
