import { FormEvent, useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useBackend } from '../../contexts/BackendContext'
import { BackendAuthenticationState } from '../../api/utils'

type DashboardLoginProps = {
  authenticationState: BackendAuthenticationState
}

const DashboardLogin = ({ authenticationState }: DashboardLoginProps) => {
  const backend = useBackend()
  const [token, setToken] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    backend.login(token)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-white">
      <form
        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-8 shadow-2xl"
        onSubmit={submit}
      >
        <div className="mb-6 flex justify-center text-blue-400">
          <LockOutlinedIcon fontSize="large" />
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold">
          Dashboard access
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Enter the backend access token to continue.
        </p>
        <div className="mb-2 text-sm font-semibold">Access token</div>
        <input
          aria-label="Access token"
          type="password"
          autoComplete="current-password"
          className="mb-4 w-full rounded border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-blue-500"
          value={token}
          onChange={event => setToken(event.target.value)}
        />
        {authenticationState === 'invalidToken' && (
          <p className="mb-4 text-sm text-red-400">Invalid access token.</p>
        )}
        <button
          type="submit"
          disabled={!token.trim() || authenticationState === 'connecting'}
          className="w-full rounded bg-blue-700 px-4 py-3 font-bold transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          {authenticationState === 'connecting' ? 'Connecting…' : 'Connect'}
        </button>
      </form>
    </main>
  )
}

export default DashboardLogin
