import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { 
  sepolia,        // Ethereum Sepolia Testnet
  polygonAmoy,    // Polygon Amoy Testnet
  arbitrumSepolia, // Arbitrum Sepolia Testnet
  optimismSepolia, // Optimism Sepolia Testnet
  baseSepolia,    // Base Sepolia Testnet
  scrollSepolia   // Scroll Sepolia Testnet
} from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
    },
  },
})

// 1. Get projectId from https://dashboard.reown.com
// IMPORTANTE: Debes crear un proyecto en https://dashboard.reown.com y reemplazar este valor
// con tu Project ID real. Sin esto, Reown AppKit no funcionará correctamente.
// 
// Project ID real de TicketSafer:
const projectId = '8505f6eaaa44b34387416821007c224f'
// 
// Para desarrollo local, puedes usar este Project ID de prueba:
// const projectId = 'c4f79cc821944d9680842e34466bfbd9' // Project ID de prueba para desarrollo

// 2. Create a metadata object - optional
const metadata = {
  name: 'TicketSafer',
  description: 'La primera plataforma multichain de tickets NFT - TESTNET',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80']
}

// 3. Set the networks - SOLO TESTNETS para desarrollo
const networks = [
  sepolia,        // Ethereum Sepolia Testnet
  polygonAmoy,    // Polygon Amoy Testnet
  arbitrumSepolia, // Arbitrum Sepolia Testnet
  optimismSepolia, // Optimism Sepolia Testnet
  baseSepolia,    // Base Sepolia Testnet
  scrollSepolia   // Scroll Sepolia Testnet
]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Desactivado para evitar conflictos
    smartSessions: false,
    chainAbstraction: false,
    pay: false,
    onramp: false,
    swaps: false,
    sponsoredTransactions: false,
    verify: false,
    relay: false,
    blockchainApi: false,
    email: false, // Desactivado temporalmente
    socials: false, // Desactivado temporalmente
    siwe: false,
    siwx: false,
    smartAccounts: false,
    customConnectors: false,
    customNetworks: false,
    multichain: true,
    theming: true
  },
  // Configuración específica para el modal
  modalConfig: {
    // Posicionamiento del modal
    position: 'center', // 'center', 'top', 'bottom'
    // Margen desde la parte superior
    topMargin: '10vh', // 10% del viewport height
    // Margen desde la parte inferior
    bottomMargin: '10vh',
    // Ancho máximo del modal
    maxWidth: '400px',
    // Altura máxima del modal
    maxHeight: '80vh',
    // Z-index para asegurar que esté por encima de todo
    zIndex: 9999,
    // Animación de entrada
    animation: {
      type: 'slide', // 'slide', 'fade', 'scale'
      duration: 300,
      easing: 'ease-out'
    },
    // Configuración del backdrop
    backdrop: {
      blur: true,
      opacity: 0.5,
      closeOnClick: true
    }
  }
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export { queryClient, wagmiAdapter, networks, metadata } 