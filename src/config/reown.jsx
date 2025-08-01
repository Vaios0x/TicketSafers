import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet, base, scroll, polygon, optimism } from '@reown/appkit/networks';
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

// Project ID from Reown Dashboard
const projectId = '8505f6eaaa44b34387416821007c224f';

// Create metadata object
const metadata = {
  name: 'TicketSafer',
  description: 'Plataforma multichain de tickets NFT',
  url: 'https://ticketsafer.com',
  icons: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80']
};

// Set networks - TicketSafer soporta múltiples redes
const networks = [mainnet, arbitrum, base, scroll, polygon, optimism];

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
    smartAccounts: false, // Deshabilitado por ahora
    embeddedWallets: false // Deshabilitado por ahora
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