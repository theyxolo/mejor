import { useTranslation } from 'react-i18next'
import * as Tabs from '@radix-ui/react-tabs'
import { Grid, Image, List, Server, XOctagon } from 'react-feather'
import styled from 'styled-components/macro'
import { ErrorBoundary } from '@sentry/react'
import { useLocation } from 'react-router'

import { Main } from 'GlobalStyled'

import Attributes from 'containers/Attributes'
import Token from 'containers/General'
import Artwork from 'containers/Artwork'
import Templates from 'containers/Templates'
import Rules from 'containers/Rules'
import Error from 'containers/Error'

const TABS = [
	{ label: 'attributes', icon: <Grid size={18} strokeWidth={2.5} /> },
	{ label: 'templates', icon: <Server size={18} strokeWidth={2.5} /> },
	{ label: 'collection', icon: <List size={18} strokeWidth={2.5} /> },
	{ label: 'artwork', icon: <Image size={18} strokeWidth={2.5} /> },
	{ label: 'rules', icon: <XOctagon size={18} strokeWidth={2.5} /> },
]

const TabItem = styled(Tabs.Trigger)`
	font-weight: 900;
	width: 100%;
	text-align: left;
	font-size: 0.9rem;
	background: transparent;
	text-align: left;
	min-height: 40px;
	min-width: 150px;
	justify-content: flex-start;
	position: relative;

	span {
		color: white;
		display: flex;
		align-items: center;
		gap: var(--space--medium);
		padding: 10px 14px;
		opacity: 0.8;
		border-radius: var(--border_radius--small);

		&:hover {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	&[aria-selected='true'] {
		span {
			opacity: 1;
		}

		&:after {
			content: '';
			position: absolute;
			top: 0;
			right: -2px;
			width: 3px;
			height: 100%;
			background-color: var(--colors--background_opposite);
		}
	}
`

const TabList = styled(Tabs.List)`
	display: flex;
	flex-direction: column;
	border-right: 2px solid var(--colors--border);
	min-height: 100%;
	padding: 8px 0;
	gap: 4px;
`

function Configuration() {
	const { t } = useTranslation()
	const { state } = useLocation()

	return (
		<Main style={{ display: 'grid', gridTemplateRows: '1fr' }}>
			<Tabs.Root
				defaultValue={state ?? 'attributes'}
				style={{ display: 'flex', minHeight: 0 }}
			>
				<TabList>
					{TABS.map((key) => (
						<TabItem key={key.label} value={key.label}>
							<span>
								{key.icon}
								{t(key.label)}
							</span>
						</TabItem>
					))}
				</TabList>
				<ErrorBoundary fallback={<Error />}>
					<Tabs.Content
						value="attributes"
						style={{ padding: 10, flex: 1, overflow: 'scroll' }}
					>
						<Attributes />
					</Tabs.Content>
					<Tabs.Content
						value="artwork"
						style={{ padding: 10, flex: 1, overflow: 'scroll' }}
					>
						<Artwork />
					</Tabs.Content>
					<Tabs.Content
						value="templates"
						style={{ padding: 10, flex: 1, overflow: 'scroll' }}
					>
						<Templates />
					</Tabs.Content>
					<Tabs.Content
						value="collection"
						style={{ padding: 10, flex: 1, overflow: 'scroll' }}
					>
						<Token />
					</Tabs.Content>
					<Tabs.Content
						value="rules"
						style={{ padding: 10, flex: 1, overflow: 'scroll' }}
					>
						<Rules />
					</Tabs.Content>
				</ErrorBoundary>
			</Tabs.Root>
		</Main>
	)
}

export default Configuration
