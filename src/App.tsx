import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import Notifications from './views/Notifications'
import Weather from './views/Weather'
import More from './views/More'
import Error404 from './views/Error404'
import Layout from './layout/Layout'
import SectionIndex from './views/section/SectionIndex'
import { HomeAssistantContextProvider } from './contexts/HomeAssistantContext'
import { ModalContextProvider } from './contexts/ModalContext'
import { BackendContextProvider } from './contexts/BackendContext'

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
        path: '/more',
        element: <More />
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
      <BackendContextProvider>
        <ModalContextProvider>
          <RouterProvider router={router} />
        </ModalContextProvider>
      </BackendContextProvider>
    </HomeAssistantContextProvider>
  )
}

export default App
