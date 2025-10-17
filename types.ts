
export interface WifiNetwork {
  ssid: string;
  signalStrength: number; // 1 to 4
  isSecure: boolean;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  FAILED = 'FAILED',
}
