import * as Tabs from '@radix-ui/react-tabs'
import styled from 'styled-components/macro'

export const TabItem = styled(Tabs.Trigger)`
	text-align: left;
	font-size: var(--font_size--small);
	background: transparent;
	text-align: left;
	min-height: 40px;
	justify-content: flex-start;
	position: relative;

	span {
		color: var(--colors--text);
		display: flex;
		align-items: center;
		gap: var(--space--medium);
		padding: 10px 14px;
		opacity: 0.65;
		border-radius: var(--border_radius--small);

		&:hover {
			background: var(--colors--overlay_alternate);
		}
	}

	&[aria-selected='true'] {
		span {
			opacity: 1;
		}
	}
`

export const TabList = styled(Tabs.List)`
	display: flex;
	flex-direction: row;
	padding: 8px 0;
`

export const TabRoot = styled(Tabs.Root)`
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
`

export const TabContent = styled(Tabs.Content)`
	padding: var(--space--medium) var(--space--large);
	flex: 1;
	overflow: scroll;
`
