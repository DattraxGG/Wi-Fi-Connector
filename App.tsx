
import React, { useState, useEffect, useCallback } from 'react';
import { WifiNetwork, ConnectionStatus } from './types';
import NetworkItem from './components/NetworkItem';
import { RefreshIcon } from './components/icons/RefreshIcon';
import { WifiIcon } from './components/icons/WifiIcon';

const MOCK_SSIDS = [
  "CoffeeShop_FreeWiFi", "City_Public_Access", "Library Guest", "MySecretLair_5G", "NeighborNet_2.4", 
  "xfinitywifi", "QuantumFiber-5G", "MainframeLink", "TheLanBeforeTime", "PrettyFlyForAWiFi"
];

// Define components outside parent components to avoid unnecessary re-renders.
const StatusDisplay: React.FC<{ status: ConnectionStatus; connectedSSID: string | null; failureMessage: string | null }> = ({ status, connectedSSID, failureMessage }) => {
  switch (status) {
    case ConnectionStatus.CONNECTED:
      return (
        <div className="flex items-center space-x-2 text-green-400">
          <WifiIcon level={4} className="w-5 h-5" />
          <span>Connected to <strong>{connectedSSID}</strong></span>
        </div>
      );
    case ConnectionStatus.CONNECTING:
      return (
        <div className="flex items-center space-x-2 text-blue-400">
          <div className="w-4 h-4 border-2 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
          <span>Connecting to <strong>{connectedSSID}</strong>...</span>
        </div>
      );
    case ConnectionStatus.FAILED:
      return <div className="text-red-400">{failureMessage}</div>;
    case ConnectionStatus.DISCONNECTED:
    default:
      return <div className="text-slate-400">Not Connected</div>;
  }
};


const App: React.FC = () => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [connectedSSID, setConnectedSSID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  const scanForNetworks = useCallback(() => {
    setIsLoading(true);
    setNetworks([]);
    setTimeout(() => {
      const newNetworks = MOCK_SSIDS
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 5) // Get 5-8 random networks
        .map(ssid => ({
          ssid,
          signalStrength: Math.floor(Math.random() * 4) + 1 as (1|2|3|4),
          isSecure: Math.random() > 0.4, // 60% are secure
        }));
      setNetworks(newNetworks);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    scanForNetworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = (network: WifiNetwork) => {
    if (status === ConnectionStatus.CONNECTING) return;
    
    if (network.isSecure) {
      setFailureMessage("Connection Failed: Password required for secure networks.");
      setStatus(ConnectionStatus.FAILED);
      setTimeout(() => {
        setStatus(ConnectionStatus.DISCONNECTED);
        setFailureMessage(null);
      }, 3000);
      return;
    }

    setConnectedSSID(network.ssid);
    setStatus(ConnectionStatus.CONNECTING);

    setTimeout(() => {
      setStatus(ConnectionStatus.CONNECTED);
    }, 2500);
  };

  const handleDisconnect = () => {
    setStatus(ConnectionStatus.DISCONNECTED);
    setConnectedSSID(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-slate-950/50">
          <header className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h1 className="text-lg font-bold text-slate-200">Wi-Fi Networks</h1>
            <div className="h-8 flex items-center">
              <StatusDisplay status={status} connectedSSID={connectedSSID} failureMessage={failureMessage} />
            </div>
          </header>

          <main className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Available Networks</span>
              <button 
                onClick={scanForNetworks} 
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait transition-colors"
                aria-label="Scan for networks"
              >
                <RefreshIcon className={`w-5 h-5 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                <p>Scanning for networks...</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {networks.length > 0 ? (
                  networks.map((network) => (
                    <NetworkItem
                      key={network.ssid}
                      network={network}
                      status={status}
                      connectedSSID={connectedSSID}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    <p>No networks found.</p>
                    <p className="text-sm">Try scanning again.</p>
                  </div>
                )}
              </ul>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
