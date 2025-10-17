
import React from 'react';
import { WifiNetwork, ConnectionStatus } from '../types';
import { WifiIcon } from './icons/WifiIcon';
import { LockIcon } from './icons/LockIcon';

interface NetworkItemProps {
  network: WifiNetwork;
  status: ConnectionStatus;
  connectedSSID: string | null;
  onConnect: (network: WifiNetwork) => void;
  onDisconnect: () => void;
}

const NetworkItem: React.FC<NetworkItemProps> = ({ network, status, connectedSSID, onConnect, onDisconnect }) => {
  const { ssid, signalStrength, isSecure } = network;
  const isConnected = status === ConnectionStatus.CONNECTED && connectedSSID === ssid;
  const isConnecting = status === ConnectionStatus.CONNECTING && connectedSSID === ssid;

  const renderButton = () => {
    if (isConnected) {
      return (
        <button
          onClick={onDisconnect}
          className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      );
    }

    if (isConnecting) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Connecting...</span>
        </div>
      );
    }
    
    return (
      <button
        onClick={() => onConnect(network)}
        disabled={status === ConnectionStatus.CONNECTING}
        className="px-3 py-1 text-sm font-semibold text-slate-900 bg-slate-300 rounded-md hover:bg-white disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
      >
        Connect
      </button>
    );
  };

  return (
    <li className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center space-x-4">
        <WifiIcon level={signalStrength} className="w-6 h-6 text-slate-300" />
        <span className="font-medium text-slate-200">{ssid}</span>
        {isSecure && <LockIcon className="w-4 h-4 text-slate-500" />}
      </div>
      <div className="w-32 text-right">
        {renderButton()}
      </div>
    </li>
  );
};

export default NetworkItem;
