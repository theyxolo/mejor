import * as ToastPrimitive from '@radix-ui/react-toast'
import styled, { keyframes } from 'styled-components/macro'

export const hide = keyframes`
	from {
    opacity: 1;
  }
	to {
    opacity: 0;
  }
`

export const slideIn = keyframes`
	from {
    transform: translateY(calc(-200% + var(--space--medium)));
  }
	to {
    transform: translateY(0);
  }
`

export const swipeOut = keyframes`
	from {
    transform: translateY(var(--radix-toast-swipe-end-x));
  }
	to {
    transform: translateY(calc(-200% + var(--space--medium)));
  }
`
export const Viewport = styled(ToastPrimitive.Viewport)`
	position: fixed;
	top: 0;
	right: 50%;
	transform: translateX(50%);
	display: flex;
	flex-direction: column;
	padding: var(--space--medium);
	gap: 10px;
	width: 100%;
	max-width: var(--size--toast);
	margin: 0;
	list-style: none;
	/* This value is coming from the radix example https://www.radix-ui.com/docs/primitives/components/toast */
	z-index: 2147483647;
	outline: none;
`

export const Toast = styled(ToastPrimitive.Root)`
	background-color: black;
	backdrop-filter: blur(10px);
	border-radius: var(--border_radius--large);
	padding: var(--space--large);
	display: grid;
	grid-template-areas: 'title' 'description';
	grid-template-columns: auto max-content;
	column-gap: 15px;
	align-items: center;

	@media (prefers-reduced-motion: no-preference) {
		&[data-state='open'] {
			animation: ${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1);
		}
		&[data-state='closed'] {
			animation: ${hide} 100ms ease-in;
		}
		&[data-swipe='move'] {
			transform: translateX(var(--radix-toast-swipe-move-x));
		}
		&[data-swipe='cancel'] {
			transform: translateX(0);
			transition: transform 200ms ease-out;
		}
		&[data-swipe='end'] {
			animation: ${swipeOut} 100ms ease-out;
		}
	}
`

export const Title = styled(ToastPrimitive.Title)`
	grid-area: title;
	margin-bottom: var(--space--xxsmall);
	font-weight: 500;
	color: white;
	font-size: 0.9rem;
`

export const Description = styled(ToastPrimitive.Description)`
	grid-area: description;
	margin: 0;
	color: white;
	font-size: 0.8rem;
	line-height: 1.3;
`

export const Action = styled(ToastPrimitive.Action)`
	font-size: 0.8rem;
	color: white;
`
