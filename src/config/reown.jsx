import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { 
  mainnet, 
  arbitrum, 
  base, 
  scroll, 
  polygon,
  optimism,
  bsc,
  avalanche,
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  scrollSepolia,
  polygonAmoy,
  optimismSepolia,
  bscTestnet,
  avalancheFuji
} from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Setup queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
    },
  },
});

// Project ID from Reown Dashboard - REEMPLAZAR CON TU PROJECT ID
const projectId = 'TU_PROJECT_ID';

// Create metadata object
const metadata = {
  name: 'TicketSafer',
  description: 'Plataforma multichain de tickets NFT',
  url: 'http://localhost:3000',
  icons: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80']
};

// Set networks - Mainnet y Testnet
const networks = [
  // MAINNET
  mainnet,      // Ethereum
  arbitrum,     // Arbitrum One
  base,         // Base
  scroll,       // Scroll
  polygon,      // Polygon
  optimism,     // Optimism
  bsc,          // BSC
  avalanche,    // Avalanche
  
  // TESTNET
  sepolia,           // Ethereum Sepolia
  arbitrumSepolia,   // Arbitrum Sepolia
  baseSepolia,       // Base Sepolia
  scrollSepolia,     // Scroll Sepolia
  polygonAmoy,       // Polygon Amoy
  optimismSepolia,   // Optimism Sepolia
  bscTestnet,        // BSC Testnet
  avalancheFuji      // Avalanche Fuji
];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    smartSessions: false,
    chainAbstraction: false
  }
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export { wagmiAdapter, queryClient }; 