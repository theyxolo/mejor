import styled from 'styled-components/macro'
import { IconAlertTriangle } from '@tabler/icons-react'

import { Box } from 'components/system'

import { getAssetUrl } from 'lib'

const TokenName = styled.p`
	word-break: break-all;
	font-size: var(--font_size--small);
	border: 1px solid var(--colors--border);
	padding: var(--space--medium) var(--space--medium);
	border-bottom-left-radius: var(--border_radius--small);
	background-color: var(--colors--background_alternate);
	border-bottom-right-radius: var(--border_radius--small);
`

const TokenImage = styled.img`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
`

const TokenContainer = styled.div`
	width: 100%;
`

const TokenContent = styled(Box)`
	display: block;
	width: 100%;
	background-image: var(--image--transparent);
	background-size: 16px 16px;
	background-position: 0 0, 8px 8px;
	position: relative;
	border-radius: var(--border_radius--small);
	overflow: hidden;
`

function TokenPreview({
	address,
	assets,
	projectId,
	projectName,
	name,
	number,
	hasWarning,
}: {
	address: string
	assets: string[]
	projectId: string
	projectName?: string
	name?: string
	number?: number
	hasWarning?: boolean
}) {
	return (
		<TokenContainer>
			<TokenContent
				paddingTop="100%"
				style={{
					borderBottomLeftRadius: name ? 0 : 'var(--border_radius--small)',
					borderBottomRightRadius: name ? 0 : 'var(--border_radius--small)',
				}}
			>
				{assets?.map((assetKey) => (
					<TokenImage
						key={assetKey}
						style={{}}
						src={getAssetUrl(assetKey, {
							address: address!,
							project: projectId!,
						})}
						alt=""
					/>
				))}
			</TokenContent>
			{Boolean(name) && (
				<TokenName
					style={{
						backgroundColor:
							assets.length === 1 ? 'var(--colors--tint)' : undefined,
						color: assets.length === 1 ? 'white' : undefined,
						borderColor: assets.length === 1 ? 'var(--colors--uva)' : undefined,
					}}
				>
					{name
						?.replace('{{number}}', String(number))
						.replace?.('{{project}}', projectName ?? '') ?? number}
					{Boolean(hasWarning) && (
						<IconAlertTriangle
							size={16}
							style={{ display: 'inline-block' }}
							strokeWidth={3}
							color="var(--colors--pina)"
						/>
					)}
				</TokenName>
			)}
		</TokenContainer>
	)
}

export default TokenPreview
