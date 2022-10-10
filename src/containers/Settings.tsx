import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, GitHub } from 'react-feather'

import { Main } from 'GlobalStyled'
import Button, { Icon } from 'components/Button'
import { Flex } from 'components/system'

function Settings() {
	const { t } = useTranslation()
	const [nftStorageKey, setNftStorageKey] = useState(
		localStorage.getItem('@mejor/nftStorageKey') ?? '',
	)

	function handleLanguageChange({ target: { value } }: any) {
		if (value) {
			localStorage.setItem('i18nextLng', value)
		} else {
			localStorage.removeItem('i18nextLng')
		}
		window.location.reload()
	}

	return (
		<Main withPadding>
			<h2>{t('settings')}</h2>
			<Flex
				flexDirection="column"
				gap="var(--space--medium)"
				alignItems="start"
			>
				<label htmlFor="">
					<b>Storage.NFT Key</b>
					<input
						type="text"
						name="nft.storage"
						value={nftStorageKey}
						placeholder="nft.storage"
						onBlur={(event) =>
							localStorage.setItem('@mejor/nftStorageKey', event.target.value)
						}
						onChange={(event) => setNftStorageKey(event.target.value)}
					/>
				</label>
				<label>
					<b>{t('language')}</b>
					<select
						value={localStorage.getItem('i18nextLng') ?? ''}
						onChange={handleLanguageChange}
					>
						<option value="">Auto</option>
						<option value="en">English</option>
						<option value="es">Español</option>
					</select>
				</label>
			</Flex>

			<hr />

			<h3 style={{ marginTop: 16 }}>{t('support')}</h3>
			<Flex gap="var(--space--medium)" marginBottom="var(--space--medium)">
				<Button
					as="a"
					target="_blank"
					rel="noopener noreferrer"
					href="https://discord.com/channels/969072055557447700/1023992163572396042"
				>
					{t('discordChannel')}
					<Icon as={ExternalLink} />
				</Button>

				<Button
					as="a"
					target="_blank"
					rel="noopener noreferrer"
					href="https://github.com/theyxolo/mejor"
				>
					GitHub
					<Icon as={GitHub} />
				</Button>
			</Flex>
			<p
				style={{
					marginTop: 4,
					maxWidth: 400,
					opacity: 0.4,
					fontSize: '0.8rem',
				}}
			>
				{t('support.disclosure')}
			</p>

			<hr />

			<h3 style={{ margin: 'var(--space--large) 0' }}>{t('credits')}</h3>

			<p style={{ fontWeight: '800', marginBottom: 'var(--space--large)' }}>
				Made with <i>Mucho Cariño</i> by{' '}
				<a style={{ color: 'inherit' }} href="https://theyxolo.art">
					TheyXolo
				</a>
			</p>
			<p style={{ fontWeight: '800' }}>
				<a href="https://theyxolo.art/licenses">{t('licenses')}</a>
			</p>
		</Main>
	)
}

export default Settings
