import * as Tabs from '@radix-ui/react-tabs'
import styled from 'styled-components/macro'

export const TabItem = styled(Tabs.Trigger)`
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
		color: var(--colors--text);
		display: flex;
		align-items: center;
		gap: var(--space--medium);
		padding: 10px 14px;
		opacity: 0.8;
		border-radius: var(--border_radius--small);

		&:hover {
			background: var(--colors--overlay_alternate);
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

export const TabList = styled(Tabs.List)`
	display: flex;
	flex-direction: column;
	border-right: 2px solid var(--colors--border);
	min-height: 100%;
	padding: 8px 0;
	gap: 4px;
`

export const TabRoot = styled(Tabs.Root)`
	min-height: 0;
	display: flex;
`

export const TabContent = styled(Tabs.Content)`
	padding: 10px;
	flex: 1;
	overflow: scroll;
`
