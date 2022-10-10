import { MouseEventHandler, useMemo, useRef, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, RefreshCw, UploadCloud } from 'react-feather'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components/macro'
import createKeccakHash from 'keccak'
import { useAccount } from 'wagmi'

import TokenPreview from 'modules/TokenPreview'

import Button, { Icon } from 'components/Button'
import { Flex } from 'components/system'

import type { UserConfig } from 'lib/types'
import { useOut } from 'lib/context/out'

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
`

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

	const { values } = useFormikContext<UserConfig>()
	const [{ value: project }] = useField(`projects.${projectId}`)
	const [out, regenerate] = useOut(projectId!)
	const [{ value: tokenName }] = useField(`projects.${projectId}.metadata.name`)

	function handleGenerate() {
		if (!project) return

		regenerate?.(values)
	}

	function handleExport(
		type: 'ipfs' | MouseEventHandler<any> | undefined | void,
	) {
		setIsExporting(typeof type === 'string' ? type : true)
	}

	const exportKey = useMemo(() => {
		if (!out) return ''
		return createKeccakHash('keccak256').update(out.toString()).digest('hex')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [out?.toString()])

	const duplicates = getOutDuplicates(out ?? [])

	return (
		<>
			{isExporting && (
				<ExportDialog
					exportKey={exportKey}
					project={projectId!}
					address={address!}
					uploadTo={typeof isExporting === 'string' ? isExporting : undefined}
					onOpenChange={(open) => setIsExporting(open)}
					total={out?.length ?? 0}
					open
				/>
			)}
			<Main
				ref={parentRef as any}
				style={{
					display: 'grid',
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
								color: 'white',
								textDecoration: 'none',
							}}
							state="templates"
							to="../token"
						>
							{t('editTemplate')}
						</Link>
						<Button onClick={handleGenerate}>
							{t(out ? 'regenerate' : 'generate')}
							<RefreshCw
								size={14}
								strokeWidth={2.5}
								style={{ marginLeft: 4 }}
							/>
						</Button>
						{out && (
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
				<PreviewContent>
					{out && out?.length && (
						<VirtuosoGrid
							style={{ height: '100%' }}
							totalCount={out.length}
							components={{ List: ListContainer }}
							itemContent={(index) => (
								<TokenPreview
									address={address!}
									assets={out[index]}
									projectId={projectId!}
									projectName={project.name}
									number={index + 1}
									name={tokenName}
									hasWarning={duplicates.includes(JSON.stringify(out[index]))}
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
