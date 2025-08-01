import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { 
  arbitrum, 
  base, 
  optimism, 
  polygon 
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

// Project ID from Reown Dashboard
const projectId = '8505f6eaaa44b34387416821007c224f';

// Create metadata object
const metadata = {
  name: 'TicketSafer',
  description: 'Plataforma multichain de tickets NFT - Arbitrum, Base, Optimism, Polygon',
  url: 'https://ticketsafer.com',
  icons: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80']
};

// Solo las redes que soportamos en TicketSafer
const networks = [arbitrum, base, optimism, polygon];

// Create Wagmi Adapter con configuración específica
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  // Configuración específica para TicketSafer
  options: {
    // Solo mostrar estas redes
    showAllNetworks: false,
    // Orden específico de redes
    networkOrder: ['arbitrum', 'base', 'optimism', 'polygon'],
    // Configuración de wallets preferidas
    connectorOrder: [
      'walletConnect',
      'injected',
      'coinbase',
      'metamask'
    ]
  }
});

// Create modal con configuración específica
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    smartAccounts: false, // Deshabilitado por ahora
    embeddedWallets: false, // Deshabilitado por ahora
    // Configuración específica para multichain
    multichain: {
      enabled: true,
      // Solo estas redes
      allowedNetworks: ['arbitrum', 'base', 'optimism', 'polygon'],
      // Configuración de red por defecto
      defaultNetwork: 'arbitrum'
    }
  },
  // Configuración para modal más compacto
  modal: {
    size: 'compact', // Modal más pequeño
    maxHeight: '80vh', // Altura máxima del 80% de la ventana
    maxWidth: '400px', // Ancho máximo más pequeño
    responsive: {
      mobile: {
        maxHeight: '90vh',
        maxWidth: '95vw',
        padding: '16px'
      },
      tablet: {
        maxHeight: '85vh',
        maxWidth: '500px',
        padding: '20px'
      }
    }
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