import * as SwitchPrimitive from '@radix-ui/react-switch'
import styled from 'styled-components/macro'

const StyledSwitch = styled(SwitchPrimitive.Root)<{ disabled?: boolean }>`
	all: unset;
	width: 42px;
	height: 25px;
	background-color: black;
	border-radius: 9999px;
	position: relative;
	cursor: default;

	${({ disabled }) =>
		disabled &&
		`
		pointer-events: none;
		opacity: 0.5;
	`}

	webkit-tap-highlight-color: rgba(0, 0, 0, 0);

	&:focus {
		box-shadow: 0 0 0 2px var(--colors--uva);
	}

	&[data-state='checked'] {
		background-color: var(--colors--uva);
	}
`

const StyledThumb = styled(SwitchPrimitive.Thumb)`
	display: block;
	width: 21px;
	height: 21px;
	background-color: white;
	border-radius: 9999px;
	box-shadow: 0 0px 4px rgba(0, 0, 0, 0.5);
	transition: transform 100ms;
	transform: translateX(2px);
	will-change: transform;

	&[data-state='checked'] {
		transform: translateX(15px);
	}
`

export const Switch = StyledSwitch
export const SwitchThumb = StyledThumb
