import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiConfig } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import { GlobalStyle } from 'GlobalStyled'

import TopNav from 'modules/TopNav'

import { chains, wagmiClient } from 'lib/web3'
import queryClient from 'lib/queryClient'
import 'lib/i18n'
import 'lib/sentry'
import 'lib/analytics'

import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<StrictMode>
		<GlobalStyle />
		<QueryClientProvider client={queryClient}>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider
					showRecentTransactions
					theme={darkTheme()}
					chains={chains}
				>
					<BrowserRouter>
						<TopNav />
						<App />
					</BrowserRouter>
				</RainbowKitProvider>
			</WagmiConfig>
		</QueryClientProvider>
	</StrictMode>,
)
