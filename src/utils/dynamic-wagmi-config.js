import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { http } from "viem";
import {
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia
} from "wagmi/chains";

// Configuración de las cadenas soportadas
export const supportedChains = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  sepolia,
  polygonAmoy,
  arbitrumSepolia,
  optimismSepolia,
  baseSepolia
];

// Configuración de Wagmi
export const wagmiConfig = createConfig({
  chains: supportedChains,
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Cliente de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
    },
  },
});

// Configuración de Dynamic
export const dynamicConfig = {
  environmentId: "3d0f1328-013a-4ed2-a16b-ecc1544c0f02", // Tu environment ID
  walletConnectors: [EthereumWalletConnectors],
  
  // Configuración de wallets
  walletConnectorExtensions: [DynamicWagmiConnector],
  
  // Lista de wallets soportadas (sin Phantom que está causando problemas)
  walletConnector: {
    walletList: [
      "metamask",
      "walletconnect",
      "coinbase",
      "rainbow",
      "trust",
      "brave"
    ],
  },

  // Configuración de UI mejorada
  uiConfig: {
    displayAddressType: "short", // short, full, none
    displayEnsName: true,
    
    // Personalización de la interfaz
    shadowDOMEnabled: false,
    
    // Configuración del modal
    modal: {
      closeOnOverlayClick: true,
    },
    
    // Configuración de wallets
    walletList: {
      mode: "grid", // grid, list
      showWalletList: true,
      showManageWalletButton: true,
    },
    
    // Configuración del perfil de usuario
    userProfile: {
      showUserProfile: true,
      showLogoutButton: true,
      showDeleteAccountButton: true,
    },
    
    // Configuración de redes
    networkPicker: {
      showNetworkPicker: true,
      showTestnets: process.env.NODE_ENV === 'development',
    },
    
    // Configuración de balance
    balance: {
      showBalance: true,
      showBalanceInUSD: true,
    },
  },

  // Eventos de callback
  eventsCallbacks: {
    onAuthSuccess: (args) => {
      console.log("✅ Dynamic Auth Success", args);
      // Aquí puedes agregar lógica personalizada después de conectar
    },
    onAuthError: (args) => {
      console.error("❌ Dynamic Auth Error", args);
    },
    onConnect: (args) => {
      console.log("🔗 Dynamic Connect", args);
    },
    onDisconnect: (args) => {
      console.log("🔌 Dynamic Disconnect", args);
    },
    onAuthFlowOpen: () => {
      console.log("🚀 Dynamic Auth Flow Opened");
    },
    onAuthFlowClose: () => {
      console.log("🔒 Dynamic Auth Flow Closed");
    },
  },

  // Configuración de cadenas
  overrides: {
    evmNetworks: supportedChains.map(chain => ({
      blockExplorerUrls: [chain.blockExplorers?.default?.url].filter(Boolean),
      chainId: chain.id,
      chainName: chain.name,
      iconUrls: [], // Puedes agregar iconos personalizados aquí
      name: chain.name,
      nativeCurrency: chain.nativeCurrency,
      networkId: chain.id,
      rpcUrls: [chain.rpcUrls.default.http[0]],
      vanityName: chain.name,
    })),
  },

  // Configuración avanzada
  appName: "TicketSafer",
  appLogoUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=64&h=64&fit=crop&auto=format&q=80", // URL completa
  
  // Configuración de WalletConnect
  walletConnectProjectId: "705647bd297da3c2ea969a7940191475",
  
  // Configuración de modo debug
  debugMode: process.env.NODE_ENV === 'development',
  
  // Configuración de privacidad
  privacyPolicyUrl: "/privacidad",
  termsOfServiceUrl: "/terminos",
  
  // Configuración de CSS personalizado
  cssOverrides: `
    /* Personalización del modal de Dynamic */
    .dynamic-modal {
      border-radius: 16px !important;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%) !important;
      backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .dynamic-wallet-list {
      gap: 12px !important;
    }
    
    .dynamic-wallet-button {
      border-radius: 12px !important;
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      transition: all 0.2s ease !important;
    }
    
    .dynamic-wallet-button:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(102, 126, 234, 0.3) !important;
      transform: translateY(-2px) !important;
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
    }
    
    .dynamic-connect-button:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
    }
  `,
};

export default {
  dynamicConfig,
  wagmiConfig,
  queryClient,
  supportedChains
}; 