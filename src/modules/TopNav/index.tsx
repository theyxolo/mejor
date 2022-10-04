import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Edit, Eye, Settings as SettingsIcon } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import * as AccessibleIcon from '@radix-ui/react-accessible-icon'

import { Flex } from 'components/system'
import { truncateMiddle } from 'lib'

const NavList = styled.ul`
	padding: 0 20px;
	display: flex;
	justify-content: center;
	gap: 10px;
	height: 100%;
`

const Header = styled.div`
	display: grid;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
	font-size: 1rem;
	grid-template-columns: repeat(3, 1fr);
	border-bottom: 2px solid var(--colors--border);
	font-family: SF Pro;

	h1 {
		font-weight: 900;
		font-size: 1.5rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: inherit;
		min-height: 40px;
		font-weight: 800;
		height: 100%;
		position: relative;

		span {
			gap: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--space--medium) var(--space--large);
			border-radius: 16px;
			overflow: hidden;
			opacity: 0.8;

			&:hover {
				background-color: var(--color--overlay_alternate);
				opacity: 1;
			}
		}

		&[aria-current='page'] {
			span {
				opacity: 1;
			}
			&:after {
				content: '';
				position: absolute;
				bottom: -2px;
				left: 0;
				height: 3px;
				width: 100%;
				background-color: var(--colors--background_opposite);
			}
		}
	}

	&:nth-child(2) {
		align-content: center;
	}

	&:nth-child(3) {
		align-content: flex-end;
	}
`

function TopNav() {
	const { t } = useTranslation()
	const { pathname } = useLocation()

	const [, projectId] = pathname.split('/')

	return (
		<Header>
			<Flex height="var(--size--top_nav)" alignItems="center" gap="8px">
				<Link to="/">
					<Flex
						as="h1"
						alignItems="center"
						gap="var(--space--small)"
						style={{ whiteSpace: 'nowrap' }}
					>
						🖼 mejor{' '}
						<span
							style={{
								backgroundColor: 'gray',
								color: 'black',
								borderRadius: 10,
								padding: '2px 8px',
								fontSize: '0.8rem',
							}}
						>
							BETA
						</span>
					</Flex>
				</Link>
				<span style={{ fontWeight: '800', opacity: 0.3, fontSize: '0.75rem' }}>
					{/* eslint-disable-next-line no-magic-numbers */}
					{truncateMiddle(projectId, 11)}
				</span>
			</Flex>
			{projectId ? (
				<NavList>
					<NavLink to={`/${projectId}/token`}>
						<span>
							<Edit size={20} />
							{t('settings')}
						</span>
					</NavLink>
					<NavLink to={`/${projectId}/preview`}>
						<span>
							<Eye size={20} />
							{t('preview')}
						</span>
					</NavLink>
				</NavList>
			) : (
				<span />
			)}
			<Flex
				height="100%"
				justifySelf="flex-end"
				margin="0"
				alignItems="center"
				gap="var(--space--small)"
			>
				<NavLink to={`/${projectId}/settings`}>
					<span>
						<AccessibleIcon.Root label={t('appSettings')}>
							<SettingsIcon size={20} />
						</AccessibleIcon.Root>
					</span>
				</NavLink>
				{/* <Button>{t('donate')}</Button> */}
				<ConnectButton chainStatus="none" showBalance={false} />
			</Flex>
		</Header>
	)
}

export default TopNav
