/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HA_HOST: string
  readonly VITE_HA_TOKEN: string
  readonly VITE_BACKEND_HOST: string
  readonly PACKAGE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
