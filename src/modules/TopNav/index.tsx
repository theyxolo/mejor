import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
	Eye,
	Edit,
	ChevronDown,
	CloudLightning,
	Settings as SettingsIcon,
} from 'react-feather'
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

import * as Styled from './styled'

function TopNav() {
	const { t } = useTranslation()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const [, projectId] = pathname.split('/')
	// eslint-disable-next-line no-magic-numbers
	const isProjectId = projectId.length === 21

	const { data } = useGetConfig(localStorage.getItem('@mejor/signedMessage'), {
		networkMode: 'offlineFirst',
		enabled: Boolean(localStorage.getItem('@mejor/signedMessage')),
		refetchOnWindowFocus: false,
	})

	const projects = Object.entries(data?.projects ?? {})

	function handleSelectChange(value: string) {
		navigate(`/${value}`)
	}

	return (
		<Styled.Header>
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
								backgroundColor: 'var(--colors--pina)',
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
					</Flex>
				</Link>
				{isProjectId && (
					<Select onValueChange={handleSelectChange} value={projectId}>
						<SelectTrigger aria-label="Food">
							<SelectValue placeholder="Select a fruit…" />
							<SelectIcon>
								<ChevronDown />
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
			</Flex>
			{isProjectId ? (
				<>
					<Styled.NavList>
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
						<NavLink to={`/${projectId}/deploy`}>
							<span>
								<CloudLightning size={20} />
								{t('deploy')}
							</span>
						</NavLink>
					</Styled.NavList>
				</>
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
				<ConnectButton chainStatus="none" showBalance={false} />
			</Flex>
		</Styled.Header>
	)
}

export default TopNav
