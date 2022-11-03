import { MouseEventHandler, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import {
	AlertTriangle,
	ChevronDown,
	RefreshCw,
	UploadCloud,
} from 'react-feather'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components/macro'
import createKeccakHash from 'keccak'
import { useAccount } from 'wagmi'
import {
	Root,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@radix-ui/react-collapsible'

import TokenPreview from 'modules/TokenPreview'

import Button, { Icon } from 'components/Button'
import { Flex } from 'components/system'

import { useFieldValue, useRegenerate } from 'lib/recoil'
import { Project } from 'lib/types'

import { Main } from 'GlobalStyled'

import ExportDialog from './ExportDialog'

const ListContainer = styled.div`
	gap: 10px;
	padding: 10px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);

	@media (min-width: 768px) {
		grid-template-columns: repeat(6, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(9, 1fr);
	}

	@media (min-width: 1280px) {
		grid-template-columns: repeat(12, 1fr);
	}
`

const PreviewContent = styled.div`
	min-height: 0;
	overflow: auto;
	padding: 0;
`

const Actions = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	grid-column: 1 / -1;
`

function AttributesFilter() {
	const attributes = useFieldValue<Project['attributes']>('attributes')
	const traits = useFieldValue<Project['traits']>('traits')
	const combinations = useFieldValue<string[][]>('export.combinations')

	return (
		<div style={{ overflowY: 'auto', padding: '0 10px' }}>
			<Flex as="ul" gap="var(--space--small)" flexDirection="column">
				{Object.entries(attributes ?? {}).map(([key, value]) => (
					<Root asChild key={key}>
						<li
							style={{
								border: '2px solid var(--colors--border)',
								borderRadius: 10,
								overflow: 'hidden',
							}}
						>
							<CollapsibleTrigger asChild>
								<Flex
									as="button"
									style={{
										width: '100%',
										backgroundColor: 'transparent',
										fontWeight: '900',
										padding: '5px 10px',
										fontSize: '1rem',
									}}
									alignItems="center"
									justifyContent="space-between"
								>
									{value.name}
									<ChevronDown />
								</Flex>
							</CollapsibleTrigger>
							<CollapsibleContent asChild>
								<Flex
									flexDirection="column"
									gap="var(--space--medium)"
									style={{ padding: '0 10px 10px' }}
								>
									{value.traits
										.map((trait) => [
											trait,
											JSON.stringify(combinations).match(new RegExp(trait, 'g'))
												?.length,
										])
										.sort((a, b) => Number(a[1]) - Number(b[1]))
										.map(([trait, count]) => (
											<li key={trait}>
												<Flex
													flexDirection="row"
													alignItems="center"
													style={{
														// eslint-disable-next-line no-magic-numbers
														opacity: traits[trait!].showInMetadata ? 1 : 0.3,
													}}
													justifyContent="space-between"
												>
													<Flex
														as="label"
														flexDirection="row"
														alignItems="center"
													>
														<p style={{ fontWeight: '700' }}>
															{traits[trait!].name}
														</p>
													</Flex>
													<p style={{ opacity: 0.7 }}>{count}</p>
												</Flex>
											</li>
										))}
								</Flex>
							</CollapsibleContent>
						</li>
					</Root>
				))}
			</Flex>
		</div>
	)
}

function getOutDuplicates(array: string[][]) {
	const jsonOut = array.map((item) => JSON.stringify(item))

	// Get duplicate items
	const count = {} as Record<string, number>
	jsonOut.forEach((item) => {
		count[item] = count[item] + 1 || 1
	})
	const duplicates = Object.keys(count).filter((item) => count[item] > 1)
	return duplicates
}

function Preview() {
	const { t } = useTranslation()
	const { address } = useAccount()
	const parentRef = useRef()
	const { projectId } = useParams()

	const [isExporting, setIsExporting] = useState<'ipfs' | boolean>(false)

	const regenerate = useRegenerate()
	const combinations = useFieldValue<string[][]>('export.combinations')
	const tokenName = useFieldValue<string>('metadata.name')
	const projectName = useFieldValue<string>('name')

	function handleGenerate() {
		regenerate()
	}

	function handleExport(
		type: 'ipfs' | MouseEventHandler<any> | undefined | void,
	) {
		setIsExporting(typeof type === 'string' ? type : true)
	}

	const exportKey = useMemo(() => {
		if (!combinations) return ''
		return createKeccakHash('keccak256')
			.update(combinations.toString())
			.digest('hex')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [combinations?.toString()])

	const duplicates = getOutDuplicates(combinations ?? [])

	return (
		<>
			{isExporting && (
				<ExportDialog
					exportKey={exportKey}
					project={projectId!}
					address={address!}
					uploadTo={typeof isExporting === 'string' ? isExporting : undefined}
					onOpenChange={(open) => setIsExporting(open)}
					total={combinations?.length ?? 0}
					open
				/>
			)}
			<Main
				ref={parentRef as any}
				style={{
					display: 'grid',
					gridTemplateColumns: '300px 1fr',
					gridTemplateRows: 'auto 1fr',
				}}
			>
				<Actions>
					<Flex alignItems="center" gap="var(--space--small)">
						<h2 style={{ margin: 0 }}>{t('preview')}</h2>
						{duplicates.length > 0 && (
							<Icon
								strokeWidth={3}
								as={AlertTriangle}
								color="var(--colors--pina)"
							/>
						)}
					</Flex>
					<Flex gap="var(--space--medium)">
						<Link
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								color: 'var(--colors--text)',
								textDecoration: 'none',
							}}
							state="templates"
							to="../token"
						>
							{t('editTemplate')}
						</Link>
						<Button onClick={handleGenerate}>
							{t(combinations ? 'regenerate' : 'generate')}
							<RefreshCw
								size={14}
								strokeWidth={2.5}
								style={{ marginLeft: 4 }}
							/>
						</Button>
						{combinations && (
							<Button
								onClick={handleExport}
								options={[
									{
										label: t('exportAndUploadToIPFS'),
										onClick: () => handleExport('ipfs'),
										icon: <UploadCloud size={14} strokeWidth={2.5} />,
										disabled: !localStorage.getItem('@mejor/nftStorageKey'),
									},
								]}
								primary
							>
								{t('export')}
							</Button>
						)}
					</Flex>
				</Actions>
				<AttributesFilter />
				<PreviewContent>
					{combinations && combinations?.length && (
						<VirtuosoGrid
							style={{ height: '100%' }}
							totalCount={combinations.length}
							components={{ List: ListContainer }}
							itemContent={(index) => (
								<TokenPreview
									address={address!}
									assets={combinations[index]}
									projectId={projectId!}
									projectName={projectName}
									number={index + 1}
									name={tokenName}
									hasWarning={duplicates.includes(
										JSON.stringify(combinations[index]),
									)}
								/>
							)}
						/>
					)}
				</PreviewContent>
			</Main>
		</>
	)
}

export default Preview
