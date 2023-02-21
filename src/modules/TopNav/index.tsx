import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
	IconChevronDown,
	IconRocket,
	IconPalette,
	IconSettings,
	IconGridDots,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as AccessibleIcon from '@radix-ui/react-accessible-icon'

import { Flex } from 'components/system'
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectItemText,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
	SelectViewport,
} from 'components/Select'

import { useGetConfig } from 'lib/api'
import { SIGNED_MESSAGE_KEY } from 'lib/constants'

import * as Styled from './styled'

function TopNav() {
	const { t } = useTranslation()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const [, projectId] = pathname.split('/')
	// eslint-disable-next-line no-magic-numbers
	const isProjectId = projectId.length === 21

	const { data } = useGetConfig(localStorage.getItem(SIGNED_MESSAGE_KEY), {
		networkMode: 'offlineFirst',
		enabled: Boolean(localStorage.getItem(SIGNED_MESSAGE_KEY)),
		refetchOnWindowFocus: false,
	})

	const projects = Object.entries(data?.projects ?? {})

	function handleSelectChange(value: string) {
		navigate(`/${value}`)
	}

	function renderHeading() {
		if (isProjectId) {
			return '🖼'
		}

		return (
			<>
				🖼 mejor{' '}
				<span
					style={{
						backgroundColor: 'var(--colors--pina)',
						fontFamily: "'Helvetica Neue'",
						fontWeight: '900',
						color: 'black',
						borderRadius: 10,
						padding: '2px 8px',
						fontSize: '0.8rem',
						opacity: 1,
						lineHeight: '12px',
					}}
				>
					BETA
				</span>
			</>
		)
	}

	return (
		<Styled.Header>
			<Flex height="var(--size--top_nav)" alignItems="center" gap="8px">
				<Link to="/">
					<Flex
						as="h1"
						alignItems="center"
						gap="var(--space--small)"
						style={{
							whiteSpace: 'nowrap',
							minWidth: 40,
							textAlign: 'center',
							display: 'inline-block',
						}}
					>
						{renderHeading()}
					</Flex>
				</Link>
				<span style={{ height: '50%', width: 2, backgroundColor: 'gray' }} />
				{Boolean(isProjectId) && (
					<Select onValueChange={handleSelectChange} value={projectId}>
						<SelectTrigger aria-label={t('project')}>
							<SelectValue placeholder={t('selectAProject')} />
							<SelectIcon>
								<IconChevronDown />
							</SelectIcon>
						</SelectTrigger>
						<SelectContent>
							<SelectViewport>
								{projects.map(([key, { name }]) => (
									<SelectItem key={key} value={key}>
										<SelectItemText>{name}</SelectItemText>
									</SelectItem>
								))}
								<SelectSeparator />
								<SelectItem value="upload">
									<SelectItemText>{t('newProject')}</SelectItemText>
								</SelectItem>
							</SelectViewport>
						</SelectContent>
					</Select>
				)}
				{isProjectId ? (
					<Styled.NavList>
						<NavLink to={`/${projectId}/preview`}>
							<span>
								<IconGridDots />
								{t('preview')}
							</span>
						</NavLink>
						<NavLink to={`/${projectId}/token`}>
							<span>
								<IconPalette />
								{t('artwork')}
							</span>
						</NavLink>
						<NavLink to={`/${projectId}/deploy`}>
							<span>
								<IconRocket />
								{t('deploy')}
							</span>
						</NavLink>
					</Styled.NavList>
				) : (
					<span />
				)}
			</Flex>

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
							<IconSettings />
						</AccessibleIcon.Root>
					</span>
				</NavLink>
				<ConnectButton chainStatus="none" showBalance={false} />
			</Flex>
		</Styled.Header>
	)
}

export default TopNav
