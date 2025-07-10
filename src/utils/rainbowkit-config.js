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
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '705647bd297da3c2ea969a7940191475'

const { connectors } = getDefaultWallets({
  appName: 'TicketSafer NFT Platform',
  projectId,
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
  ]
})

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
  connectors,
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