import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export const dynamicConfig = {
  environmentId: "3d0f1328-013a-4ed2-a16b-ecc1544c0f02",
  walletConnectors: [EthereumWalletConnectors],
  settings: {
    walletList: ["metamask", "walletconnect", "coinbase", "rainbow"],
    eventsCallbacks: {
      onAuthSuccess: (args) => console.log("Auth Success", args),
      onAuthError: (args) => console.log("Auth Error", args),
      onConnect: (args) => console.log("Connect", args),
      onDisconnect: (args) => console.log("Disconnect", args),
    },
  },
}; 