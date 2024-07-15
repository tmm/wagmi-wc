import { http, createConfig, createConnector, createStorage } from "wagmi";
import { mainnet, optimism, sepolia } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

export const projectId = import.meta.env.VITE_WC_PROJECT_ID;

const rainbowWallet = createConnector((config) => ({
  ...walletConnect({ projectId })(config),
  id: "rainbow",
  name: "Rainbow",
}));

const uniswapWallet = createConnector((config) => ({
  ...walletConnect({ projectId })(config),
  id: "uniswap",
  name: "Uniswap",
}));

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [rainbowWallet, uniswapWallet, walletConnect({ projectId })],
  storage: createStorage({ storage: localStorage, key: "wagmi-wc" }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
