import { createConfig, http } from 'wagmi'
import { 
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  polygon,
  polygonMumbai
} from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Project ID de WalletConnect (opcional, puedes usar uno público o dejarlo vacío)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '705647bd297da3c2ea969a7940191475'

export const config = createConfig({
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    polygonMumbai,
    optimismSepolia,
    arbitrumSepolia,
    baseSepolia
  ],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [optimismSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
}) 