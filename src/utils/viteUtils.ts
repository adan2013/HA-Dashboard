// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getPackageVersion = (): string => import.meta.env.PACKAGE_VERSION

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getHomeAssistantHost = (): string => import.meta.env.VITE_HA_HOST

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getHomeAssistantToken = (): string => import.meta.env.VITE_HA_TOKEN

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getBackendHost = (): string => import.meta.env.VITE_BACKEND_HOST

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const isDevEnv = (): boolean => import.meta.env.DEV
