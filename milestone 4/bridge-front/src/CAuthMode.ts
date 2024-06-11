/**
 * This enum is used to differentiate between different mdoes of operation:
 * 1. dapp - a mode where there is no backend we query the wallet and receive confirmation right here.
 * 2. webapp - a mode where there is a backend, but it's a custom CAuth backend
 * 3. bridge - a mode where the backend is following OAuth 2.0 protocol
 */
export enum CAuthMode {
  dapp = 'dapp',
  webapp = 'webapp',
  bridge = 'bridge',
}
export function getCAuthMode(mode: string | undefined) {
  if (mode === 'dapp') return CAuthMode.dapp;
  if (mode === 'bridge') return CAuthMode.bridge;
  //webapp is default
  return CAuthMode.webapp;
}
