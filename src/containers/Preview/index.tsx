import { useMemo, useRef, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { DownloadCloud, RefreshCw } from 'react-feather'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components/macro'
import createKeccakHash from 'keccak'
import { useAccount } from 'wagmi'

import TokenPreview from 'modules/TokenPreview'

import Button from 'components/Button'

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

function Preview() {
	const { t } = useTranslation()
	const { address } = useAccount()
	const parentRef = useRef()
	const { projectId } = useParams()

	const [isExporting, setIsExporting] = useState(false)

	const { values } = useFormikContext<UserConfig>()
	const [{ value: project }] = useField(`projects.${projectId}`)
	const [out, regenerate] = useOut(projectId!)
	const [{ value: tokenName }] = useField(`projects.${projectId}.metadata.name`)

	function handleGenerate() {
		if (!project) return

		regenerate?.(values)
	}

	function handleExport() {
		setIsExporting(true)
	}

	const exportKey = useMemo(() => {
		if (!out) return ''
		return createKeccakHash('keccak256').update(out.toString()).digest('hex')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [out?.toString()])

	return (
		<>
			{isExporting && (
				<ExportDialog
					exportKey={exportKey}
					project={projectId!}
					address={address!}
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
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: '10px',
					}}
				>
					<h2 style={{ margin: 0 }}>{t('preview')}</h2>
					<div style={{ display: 'flex', gap: 12 }}>
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
							<Button onClick={handleExport} primary>
								{t('export')}
								<DownloadCloud
									size={14}
									strokeWidth={2.5}
									style={{ marginLeft: 4 }}
								/>
							</Button>
						)}
					</div>
				</div>
				<div
					style={{
						minHeight: 0,
						overflow: 'auto',
						padding: '0',
					}}
				>
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
									number={index}
									name={tokenName}
								/>
							)}
						/>
					)}
				</div>
			</Main>
		</>
	)
}

export default Preview
