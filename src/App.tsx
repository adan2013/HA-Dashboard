import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import Notifications from './views/Notifications'
import Weather from './views/Weather'
import Customization from './views/Customization'
import Error404 from './views/Error404'
import Layout from './layout/Layout'
import SectionIndex from './views/section/SectionIndex'
import { HomeAssistantContextProvider } from './contexts/HomeAssistantContext'
import { ModalContextProvider } from './components/modals/ModalContext'

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
      <ModalContextProvider>
        <RouterProvider router={router} />
      </ModalContextProvider>
    </HomeAssistantContextProvider>
  )
}

export default App
