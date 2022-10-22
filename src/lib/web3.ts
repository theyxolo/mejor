import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
	[chain.goerli, chain.polygonMumbai],
	[
		alchemyProvider({ apiKey: import.meta.env.VITE_APP_ALCHEMY_ID }),
		publicProvider(),
	],
)

const { connectors } = getDefaultWallets({
	appName: 'Mejor by They Xolo',
	chains,
})

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
})

export { wagmiClient, chains }
