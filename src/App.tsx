import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import Dashboard from './views/Dashboard'
import Notifications from './views/Notifications'
import Weather from './views/Weather'
import Customization from './views/Customization'
import Error404 from './views/Error404'
import Layout from './layout/Layout'
import SectionIndex from './views/section/SectionIndex'
import { GlobalContextProvider } from './contexts/GlobalContext'
import { HomeAssistantContextProvider } from './contexts/HomeAssistantContext'

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
        path: '/customization',
        element: <Customization />
      },
      {
        path: '/section/:sectionId',
        element: <SectionIndex />
      },
      {
        path: '*',
        element: <Error404 />
      }
    ]
  }
])

function App() {
  return (
    <HomeAssistantContextProvider>
      <GlobalContextProvider>
        <RouterProvider router={router} />
      </GlobalContextProvider>
    </HomeAssistantContextProvider>
  )
}

export default App
