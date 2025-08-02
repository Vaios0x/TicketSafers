// ============================================
// CONFIGURACIÓN TESTNET - TICKETSAFER
// ============================================

// Configuración específica para redes testnet
export const TESTNET_CONFIG = {
  // Project ID de Reown para testnet
  projectId: '8505f6eaaa44b34387416821007c224f',
  
  // Metadata de la aplicación
  metadata: {
    name: 'TicketSafer Testnet',
    description: 'La primera plataforma multichain de tickets NFT - TESTNET',
    url: 'http://localhost:3000',
    icons: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80']
  },
  
  // Redes testnet soportadas
  supportedNetworks: [
    {
      id: 11155111,
      name: 'Sepolia Testnet',
      shortName: 'Sepolia',
      explorer: 'https://sepolia.etherscan.io',
      color: '#627eea',
      description: 'Ethereum Sepolia Testnet'
    },
    {
      id: 80002,
      name: 'Polygon Amoy Testnet',
      shortName: 'Amoy',
      explorer: 'https://amoy.polygonscan.com',
      color: '#8247e5',
      description: 'Polygon Amoy Testnet'
    },
    {
      id: 421614,
      name: 'Arbitrum Sepolia Testnet',
      shortName: 'Arb Sepolia',
      explorer: 'https://sepolia.arbiscan.io',
      color: '#28a0f0',
      description: 'Arbitrum Sepolia Testnet'
    },
    {
      id: 11155420,
      name: 'Optimism Sepolia Testnet',
      shortName: 'Op Sepolia',
      explorer: 'https://sepolia-optimism.etherscan.io',
      color: '#ff0420',
      description: 'Optimism Sepolia Testnet'
    },
    {
      id: 84532,
      name: 'Base Sepolia Testnet',
      shortName: 'Base Sepolia',
      explorer: 'https://sepolia.basescan.org',
      color: '#0052ff',
      description: 'Base Sepolia Testnet'
    },
    {
      id: 534351,
      name: 'Scroll Sepolia Testnet',
      shortName: 'Scroll Sepolia',
      explorer: 'https://sepolia.scrollscan.com',
      color: '#f7931e',
      description: 'Scroll Sepolia Testnet'
    }
  ],
  
  // Configuración de features para testnet - TODAS ACTIVADAS
  features: {
    analytics: true,
    smartSessions: false,
    chainAbstraction: false,
    pay: false,
    onramp: false,
    swaps: false,
    sponsoredTransactions: false,
    verify: false,
    relay: false,
    blockchainApi: false,
    email: true, // ACTIVADO - Login con email
    socials: true, // ACTIVADO - Login con redes sociales
    siwe: false,
    siwx: false,
    smartAccounts: false,
    customConnectors: false,
    customNetworks: false,
    multichain: true,
    theming: true
  }
};

// Function to get network info by ID
export const getNetworkInfo = (chainId) => {
  return TESTNET_CONFIG.supportedNetworks.find(network => network.id === chainId) || {
    id: chainId,
    name: 'Unknown Testnet',
    shortName: 'Unknown',
    explorer: 'https://sepolia.etherscan.io',
    color: '#6b7280',
    description: 'Unknown Testnet'
  };
};

// Function to check if a network is supported
export const isNetworkSupported = (chainId) => {
  return TESTNET_CONFIG.supportedNetworks.some(network => network.id === chainId);
}; 