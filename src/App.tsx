import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useSignMessage } from 'wagmi'
import { useRecoilState } from 'recoil'
import { CheckCircle } from 'react-feather'
import '@rainbow-me/rainbowkit/styles.css'

import Loading from 'modules/Loading'

import Button, { Icon } from 'components/Button'
import { Main as StyledMain } from 'GlobalStyled'

import { capture, identify } from 'lib/analytics'
import { signedMessageAtom } from 'lib/recoil'
// import { getOut } from 'lib/combinationsEngine'

import Routes from './Routes'

// const initialValues = {
// 	projects: [],
// }

// const DEBOUNCE_DELAY = 3000

// const RegeneratedToast = styled(Flex)`
// 	z-index: 100000;
// 	position: fixed;
// 	bottom: 0;
// 	background-color: var(--colors--mandarina);
// 	border-radius: 20px;
// 	box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
// 	opacity: 1;
// 	animation: slide 7s forwards;

// 	@keyframes slide {
// 		0% {
// 			right: -500px;
// 		}
// 		10% {
// 			right: 0;
// 		}
// 		90% {
// 			right: 0;
// 		}
// 		100% {
// 			right: -500px;
// 		}
// 	}
// `

function App() {
	const { t } = useTranslation()
	const { address } = useAccount()

	const [signedMessage, setSignedMessage] = useRecoilState(signedMessageAtom)

	const { signMessage } = useSignMessage({
		onSuccess(data) {
			capture('signed-message')
			setSignedMessage(data)
		},
	})

	useEffect(() => {
		if (address) identify(address)
	}, [address])

	if (!address) {
		return (
			<StyledMain center>
				<h2>{t('screens.connectWallet.title')}</h2>
				<p style={{ marginBottom: 'var(--space--large)' }}>
					{t('screens.connectWallet.body')}
				</p>
				<ConnectButton showBalance={false} />
			</StyledMain>
		)
	}

	if (!signedMessage) {
		return (
			<StyledMain center>
				<h2>{t('screens.agreeTerms.title')}</h2>
				<p
					style={{
						opacity: 0.7,
						maxWidth: 800,
						margin: '0 auto',
						fontSize: '0.75rem',
						lineHeight: 1.3,
						textTransform: 'uppercase',
						whiteSpace: 'pre-wrap',
						textAlign: 'justify',
					}}
				>
					{t('screens.agreeTerms.body')}
				</p>
				<Button
					style={{ marginTop: 16 }}
					onClick={() => signMessage({ message: 'I agree to the terms' })}
				>
					{t('agree')}
					<Icon as={CheckCircle} />
				</Button>
				<span
					style={{
						marginTop: 6,
						display: 'block',
						fontWeight: '800',
						fontSize: '0.9rem',
					}}
				>
					{t('screens.agreeTerms.note')}
				</span>
			</StyledMain>
		)
	}

	return (
		<Suspense fallback={<Loading />}>
			<Routes />
			{/* {outState.regeneratedAt && (
				<RegeneratedToast
					key={outState.regeneratedAt?.getTime()}
					alignItems="center"
					gap="var(--space--medium)"
					padding="var(--space--large)"
					margin="var(--space--large)"
				>
					<AlertTriangle />
					<p style={{ fontWeight: '800' }}>{t('combinationsRegenerated')}</p>
				</RegeneratedToast>
			)} */}
		</Suspense>
	)

	// const updateConfig = useUpdateConfig()
	// const { data: configData, isFetching } = useGetConfig(signedMessage, {
	// 	cacheTime: 0,
	// 	staleTime: 0,
	// 	refetchOnWindowFocus: false,
	// 	enabled: Boolean(signedMessage),
	// 	onSuccess(data) {
	// 		if (data?.out) {
	// 			// setOut({ regeneratedAt: null, out: data.out })
	// 		}
	// 	},
	// })

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// const { out, ...userConfig } = configData ?? {}

	// const regenerateOut = useCallback(
	// 	async (values: UserConfig, mutate = true) => {
	// 		const out = Object.fromEntries(
	// 			Object.entries(values.projects).map(([projectId, project]) => [
	// 				projectId,
	// 				getOut(project),
	// 			]),
	// 		)
	// 		setOut({ regeneratedAt: new Date(), out })
	// 		if (mutate) await updateConfig.mutateAsync({ ...configData, out } as any)
	// 		// TODO: update server config
	// 		return out
	// 	},
	// 	[configData, updateConfig],
	// )

	// eslint-disable-next-line react-hooks/exhaustive-deps
	// const handleChange = useCallback(
	// 	debounce(async (newValues: UserConfig) => {
	// 		const out = await regenerateOut(newValues, false)
	// 		const newConfig = { ...newValues, out }

	// 		await updateConfig.mutateAsync(newConfig as any)
	// 	}, DEBOUNCE_DELAY),
	// 	[],
	// )
}

export default App
