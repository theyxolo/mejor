import { useTranslation } from 'react-i18next'
import { Award, Grid as GridIcon, Image, List, XOctagon } from 'react-feather'
import { ErrorBoundary } from '@sentry/react'
import { useLocation } from 'react-router'
import { memo, useMemo } from 'react'

import { Main } from 'GlobalStyled'

import Error from 'containers/Error'
import Rules from 'containers/Rules'
import Token from 'containers/General'
import Templates from 'containers/Templates'
import Attributes from 'containers/Attributes'
import CustomTokens from 'containers/CustomTokens'

import { Grid } from 'components/system'

import * as Styled from './styled'

const TABS = [
	{
		key: 'attributes',
		icon: <GridIcon size={18} strokeWidth={2.5} />,
		Component: memo(Attributes),
	},
	{
		key: 'templates',
		icon: <List size={18} strokeWidth={2.5} />,
		Component: memo(Templates),
	},
	{
		key: 'token',
		icon: <Image size={18} strokeWidth={2.5} />,
		Component: memo(Token),
	},
	{
		key: 'rules',
		icon: <XOctagon size={18} strokeWidth={2.5} />,
		Component: memo(Rules),
	},
	{
		key: 'customTokens',
		icon: <Award size={18} strokeWidth={2.5} />,
		Component: memo(CustomTokens),
	},
]

function Configuration() {
	const { t } = useTranslation()
	const { state } = useLocation()

	const Tabs = useMemo(
		() => [
			TABS.map(({ key, icon }) => (
				<Styled.TabItem key={key} value={key}>
					<span>
						{icon}
						{t(key)}
					</span>
				</Styled.TabItem>
			)),

			TABS.map(({ key, Component }) => (
				<Styled.TabContent key={key} value={key}>
					<Component />
				</Styled.TabContent>
			)),
		],
		[t],
	)

	return (
		<Grid as={Main} gridTemplateRows="1fr">
			<Styled.TabRoot defaultValue={state ?? 'attributes'}>
				<Styled.TabList>{Tabs[0]}</Styled.TabList>
				<ErrorBoundary fallback={<Error />}>{Tabs[1]}</ErrorBoundary>
			</Styled.TabRoot>
		</Grid>
	)
}

export default Configuration
