import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, DownloadCloud } from 'react-feather'
import { useQuery } from 'wagmi'
import Pusher from 'pusher-js'
import ky from 'ky'

import { Dialog, DialogContent, DialogTitle } from 'components/Dialog'
import { Progress, ProgressIndicator } from 'components/Progress'
import Button, { Icon } from 'components/Button'
import Spinner from 'components/Spinner'
import { Flex } from 'components/system'

import { capture } from 'lib/analytics'
import {
	API_HOST,
	ASSETS_BUCKET,
	NFT_STORAGE_KEY,
	SIGNED_MESSAGE_KEY,
} from 'lib/constants'

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
	cluster: 'us2',
})

const SUCCESS_STATUS_CODE = 200

function ExportDialog({
	open,
	total,
	address,
	project,
	exportKey,
	onOpenChange,
	uploadTo,
}: {
	open: boolean
	total: number
	address: string
	project: string
	exportKey: string
	onOpenChange: (open: boolean) => void
	uploadTo?: 'ipfs'
}) {
	const exportUrl = `https://${ASSETS_BUCKET}.s3.amazonaws.com/${address}/${project}/${exportKey}.zip`
	const [cids, setCids] = useState<{ assets: string; metadata: string } | null>(
		null,
	)
	const [progress, setProgress] = useState<{
		percentage: null | number
		remaining: null | number
	}>({ percentage: null, remaining: null })

	const { t } = useTranslation()

	const exportMutation = useMutation({
		mutationKey: ['export', exportKey],
		mutationFn: () =>
			ky
				.put(`${API_HOST}/generate`, {
					json: {
						project,
						signedMessage: localStorage.getItem(SIGNED_MESSAGE_KEY),
						nftStorageToken:
							uploadTo === 'ipfs'
								? localStorage.getItem(NFT_STORAGE_KEY)
								: undefined,
						hash: exportKey,
					},
				})
				.json(),
	})

	const exportQuery = useQuery(
		['exportUrl', exportKey],
		() => ky.head(exportUrl),
		{
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			// eslint-disable-next-line no-magic-numbers
			retryDelay: progress.percentage === 100 ? 3000 : 5000,
			retry: (_, { response }) =>
				response.status !== SUCCESS_STATUS_CODE && exportMutation.isSuccess
					? true
					: false,
		},
	)

	useEffect(() => {
		if (exportQuery.data?.status === SUCCESS_STATUS_CODE) return
		if (!exportMutation.isSuccess) return

		exportQuery.refetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exportQuery.data?.status, exportMutation.isSuccess])

	useEffect(() => {
		if (!exportKey || exportQuery.isIdle) return

		const channel = pusher.subscribe(exportKey)

		channel.bind(
			'generated--image',
			(data = { progress: null, remaining: null }) => {
				if (!data) return
				const { progress, remaining } = data
				if (!progress) return
				setProgress({
					// We are sending only values from 0 to 10, so we need to multiply by 10
					// eslint-disable-next-line no-magic-numbers
					percentage: progress,
					remaining,
				})
			},
		)
		channel.bind(
			'uploaded--car',
			(data: { assets: string; metadata: string }) => {
				if (!data) return
				setCids(data)
			},
		)

		return () => pusher.unsubscribe(exportKey)
	}, [exportKey, exportQuery.isIdle])

	useEffect(() => {
		if (exportMutation.isIdle && exportQuery.isError) {
			capture('export--start', { project })
			exportMutation.mutate()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exportMutation.isIdle, exportQuery.isError])

	function handleGetAsset() {
		capture('export--download', { project })
		onOpenChange(false)
	}

	const hasZip = exportQuery.isSuccess

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>{t('export')}</DialogTitle>
				<p
					style={{
						color: 'black',
						fontWeight: '800',
						backgroundColor: 'var(--colors--pina)',
						borderRadius: 'var(--border_radius--small)',
						padding: 'var(--space--medium) var(--space--large)',
					}}
				>
					{t('screens.export.disclosure')}
				</p>
				<Flex
					marginTop="var(--space--large)"
					justifyContent="center"
					gap="var(--space--small)"
					flexDirection="column"
					alignItems="center"
				>
					{cids ? (
						<Flex
							alignItems="center"
							flexDirection="column"
							gap="var(--space--large)"
						>
							<p>
								<b style={{ display: 'block' }}>Assets CID</b>
								{cids.assets}
							</p>
							<p>
								<b style={{ display: 'block' }}>Metadata CID</b>
								{cids.metadata}
							</p>
							<Button
								style={{ minHeight: 40 }}
								onClick={() => onOpenChange(false)}
							>
								{t('done')}
								<Icon as={CheckCircle} />
							</Button>
						</Flex>
					) : hasZip ? (
						<Button
							as="a"
							style={{ minHeight: 40 }}
							onClick={handleGetAsset}
							href={exportUrl}
							download
							primary
						>
							{t('downloadExport')}
							<Icon as={DownloadCloud} />
						</Button>
					) : // eslint-disable-next-line no-magic-numbers
					exportMutation.isLoading || progress.percentage === 100 ? (
						<>
							<Spinner />
							<p style={{ fontWeight: '700', opacity: 0.6 }}>
								{exportMutation.isLoading ? t('sendingData') : t('processing')}
								...
							</p>
						</>
					) : (
						<>
							<Progress value={progress.percentage ?? 0}>
								<ProgressIndicator
									style={{
										transform: `translateX(-${
											
											// eslint-disable-next-line no-magic-numbers
											100 - (progress.percentage ?? 1)
										}%)`,
									}}
								/>
							</Progress>
							<p style={{ fontWeight: '700', opacity: 0.6 }}>
								{`${progress.percentage ?? 0}% ${
									progress.remaining === 0
										? ''
										: `(${progress.remaining ?? total} ${t('remaining')})`
								}`}
							</p>
						</>
					)}
				</Flex>
			</DialogContent>
		</Dialog>
	)
}

export default ExportDialog
