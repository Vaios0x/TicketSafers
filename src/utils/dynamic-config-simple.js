import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// Configuración simplificada de Dynamic
export const dynamicSettings = {
  // ID de tu ambiente en Dynamic
  environmentId: "3d0f1328-013a-4ed2-a16b-ecc1544c0f02",
  
  // Conectores de wallet
  walletConnectors: [EthereumWalletConnectors],

  // Lista de wallets (sin Phantom que causa problemas)
  walletConnectorExtensions: [],
  
  // Configuración inicial simple
  initialAuthenticationMode: 'connect-and-sign',
  
  // Configuración de UI
  uiConfig: {
    displayAddressType: "short",
    shadowDOMEnabled: false,
    
    // Modal settings
    modal: {
      closeOnOverlayClick: true,
    },
    
    // Wallet list configuration
    walletList: {
      mode: "grid",
      showWalletList: true,
    },
    
    // User profile
    userProfile: {
      showUserProfile: true,
      showLogoutButton: true,
    },
    
    // Balance display
    balance: {
      showBalance: true,
    },

    // Network picker - IMPORTANTE para múltiples redes
    networkPicker: {
      showNetworkPicker: true,
      showTestnets: process.env.NODE_ENV === 'development', // Solo testnets en desarrollo
    },
  },

  // ⭐ CONFIGURACIÓN DE MÚLTIPLES REDES SIMPLIFICADA
  overrides: {
    evmNetworks: [
      // 🔵 Ethereum Mainnet
      {
        blockExplorerUrls: ['https://etherscan.io'],
        chainId: 1,
        chainName: 'Ethereum',
        iconUrls: [],
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        networkId: 1,
        rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/demo'],
        vanityName: 'Ethereum',
      },
      // 🟣 Polygon Mainnet
      {
        blockExplorerUrls: ['https://polygonscan.com'],
        chainId: 137,
        chainName: 'Polygon',
        iconUrls: [],
        name: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        networkId: 137,
        rpcUrls: ['https://polygon-rpc.com'],
        vanityName: 'Polygon',
      },
      // 🔵 Arbitrum One
      {
        blockExplorerUrls: ['https://arbiscan.io'],
        chainId: 42161,
        chainName: 'Arbitrum One',
        iconUrls: [],
        name: 'Arbitrum One',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        networkId: 42161,
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        vanityName: 'Arbitrum',
      },
      // 🔴 Optimism
      {
        blockExplorerUrls: ['https://optimistic.etherscan.io'],
        chainId: 10,
        chainName: 'Optimism',
        iconUrls: [],
        name: 'Optimism',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        networkId: 10,
        rpcUrls: ['https://mainnet.optimism.io'],
        vanityName: 'Optimism',
      },
      // 🔵 Base
      {
        blockExplorerUrls: ['https://basescan.org'],
        chainId: 8453,
        chainName: 'Base',
        iconUrls: [],
        name: 'Base',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        networkId: 8453,
        rpcUrls: ['https://mainnet.base.org'],
        vanityName: 'Base',
      },
      // 🧪 TESTNETS (solo si está en desarrollo)
      ...(process.env.NODE_ENV === 'development' ? [
        // Ethereum Sepolia
        {
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
          chainId: 11155111,
          chainName: 'Sepolia',
          iconUrls: [],
          name: 'Sepolia',
          nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'SEP',
            decimals: 18,
          },
          networkId: 11155111,
          rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
          vanityName: 'Sepolia',
        },
        // Polygon Amoy (nuevo testnet)
        {
          blockExplorerUrls: ['https://amoy.polygonscan.com'],
          chainId: 80002,
          chainName: 'Polygon Amoy',
          iconUrls: [],
          name: 'Polygon Amoy',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          networkId: 80002,
          rpcUrls: ['https://rpc-amoy.polygon.technology'],
          vanityName: 'Polygon Amoy',
        },
        // Base Sepolia
        {
          blockExplorerUrls: ['https://sepolia.basescan.org'],
          chainId: 84532,
          chainName: 'Base Sepolia',
          iconUrls: [],
          name: 'Base Sepolia',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          networkId: 84532,
          rpcUrls: ['https://sepolia.base.org'],
          vanityName: 'Base Sepolia',
        },
      ] : []),
    ],
  },

  // Eventos importantes
  eventsCallbacks: {
    onAuthSuccess: (args) => {
      console.log("✅ Dynamic: Usuario autenticado exitosamente", args);
    },
    onAuthError: (args) => {
      console.error("❌ Dynamic: Error en autenticación", args);
    },
    onConnect: (args) => {
      console.log("🔗 Dynamic: Wallet conectada", args);
      console.log("🌐 Red actual:", args.chainId);
    },
    onDisconnect: (args) => {
      console.log("🔌 Dynamic: Wallet desconectada", args);
    },
    onNetworkSwitch: (args) => {
      console.log("🔄 Dynamic: Red cambiada a:", args);
    },
  },

  // Configuración de app
  appName: "TicketSafer",
  appLogoUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80",
  
  // WalletConnect project ID
  walletConnectProjectId: "705647bd297da3c2ea969a7940191475",
  
  // Modo debug solo en desarrollo
  debugMode: process.env.NODE_ENV === 'development',
  
  // URLs de políticas
  privacyPolicyUrl: "/privacidad",
  termsOfServiceUrl: "/terminos",

  // CSS personalizado para el modal
  cssOverrides: `
    .dynamic-modal {
      border-radius: 20px !important;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%) !important;
      backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
    }
    
    .dynamic-modal-header {
      padding: 24px 24px 16px 24px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .dynamic-modal-title {
      font-size: 20px !important;
      font-weight: 700 !important;
      color: #ffffff !important;
      text-align: center !important;
    }
    
    .dynamic-wallet-list {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
      gap: 12px !important;
      padding: 20px !important;
    }
    
    .dynamic-wallet-button {
      border-radius: 12px !important;
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      transition: all 0.2s ease !important;
      padding: 16px 12px !important;
      min-height: 80px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    }
    
    .dynamic-wallet-button:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(102, 126, 234, 0.3) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
    
    .dynamic-wallet-name {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #ffffff !important;
      text-align: center !important;
    }
    
    .dynamic-wallet-icon {
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px !important;
    }
    
    .dynamic-connect-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      padding: 12px 24px !important;
      transition: all 0.3s ease !important;
      color: white !important;
    }
    
    .dynamic-connect-button:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
    }

    /* Network Picker Styles */
    .dynamic-network-picker {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 12px !important;
      padding: 8px 12px !important;
    }

    .dynamic-network-button {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 8px !important;
      color: #ffffff !important;
      transition: all 0.2s ease !important;
      padding: 8px 12px !important;
      margin: 4px !important;
    }

    .dynamic-network-button:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(102, 126, 234, 0.3) !important;
      transform: translateY(-1px) !important;
    }

    .dynamic-network-list {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
      gap: 8px !important;
      padding: 16px !important;
    }

    /* Estilos para indicadores de red */
    .network-indicator {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 4px 8px !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      font-weight: 600 !important;
    }

    .network-ethereum { background: rgba(98, 126, 234, 0.2) !important; color: #627eea !important; }
    .network-polygon { background: rgba(130, 71, 229, 0.2) !important; color: #8247e5 !important; }
    .network-arbitrum { background: rgba(40, 160, 240, 0.2) !important; color: #28a0f0 !important; }
    .network-optimism { background: rgba(255, 4, 32, 0.2) !important; color: #ff0420 !important; }
    .network-base { background: rgba(0, 82, 255, 0.2) !important; color: #0052ff !important; }
  `,
};

export default dynamicSettings; 