import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiConfig } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@sentry/react'
import { RecoilRoot } from 'recoil'

import { GlobalStyle } from 'GlobalStyled'

import TopNav from 'modules/TopNav'

import { chains, wagmiClient } from 'lib/wagmi'
import queryClient from 'lib/queryClient'

import 'lib/i18n'
import 'lib/sentry'
import 'lib/analytics'

import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<StrictMode>
		<GlobalStyle />
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<WagmiConfig client={wagmiClient}>
					<RainbowKitProvider
						showRecentTransactions
						theme={darkTheme()}
						chains={chains}
					>
						<ErrorBoundary fallback={<p>Fail</p>}>
							<Suspense fallback={null}>
								<BrowserRouter>
									<TopNav />
									<App />
								</BrowserRouter>
							</Suspense>
						</ErrorBoundary>
					</RainbowKitProvider>
				</WagmiConfig>
			</QueryClientProvider>
		</RecoilRoot>
	</StrictMode>,
)
