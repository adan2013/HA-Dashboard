import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import Notifications from './views/Notifications'
import Weather from './views/Weather'
import More from './views/More'
import Error404 from './views/Error404'
import Layout from './layout/Layout'
import SectionIndex from './views/section/SectionIndex'
import { ModalContextProvider } from './contexts/ModalContext'
import { BackendContextProvider } from './contexts/BackendContext'
import { useBackendAuthenticationState } from './api/hooks'
import DashboardLogin from './components/auth/DashboardLogin'

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

const AuthenticatedApp = () => {
  const authenticationState = useBackendAuthenticationState()
  if (
    authenticationState === 'missingToken' ||
    authenticationState === 'invalidToken'
  ) {
    return <DashboardLogin authenticationState={authenticationState} />
  }

  return (
    <ModalContextProvider>
      <RouterProvider router={router} />
    </ModalContextProvider>
  )
}

function App() {
  return (
    <BackendContextProvider>
      <AuthenticatedApp />
    </BackendContextProvider>
  )
}

export default App
