import * as DialogPrimitive from '@radix-ui/react-dialog'
import styled, { keyframes } from 'styled-components/macro'

const overlayShow = keyframes`
	0% { opacity: 0; }
	100% { opacity: 1; }
`

const contentShow = keyframes`
	0% { opacity: 0; transform: 'translate(-50%, -48%) scale(.96)'; }
	100% { opacity: 1; transform: 'translate(-50%, -50%) scale(1)'; }
`

const StyledOverlay = styled(DialogPrimitive.Overlay)`
	background-color: hsla(0, 0%, 0%, 0.3);
	backdrop-filter: blur(5px);
	position: fixed;
	inset: 0;

	@media (prefers-reduced-motion: no-preference) {
		animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
	}
`

const StyledContent = styled(DialogPrimitive.Content)`
	background-color: #111;
	border-radius: 24px;
	box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
		hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90vw;
	max-width: 450px;
	max-height: 85vh;
	padding: 25px;

	@media (prefers-reduced-motion: no-preference) {
		animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	&:focus {
		outline: none;
	}
`

function Content({ children, ...props }: any) {
	return (
		<DialogPrimitive.Portal>
			<StyledOverlay />
			<StyledContent {...props}>{children}</StyledContent>
		</DialogPrimitive.Portal>
	)
}

const StyledTitle = styled(DialogPrimitive.Title)`
	font-weight: 900;
	font-size: 2rem;
	margin-bottom: 16px;
`

const StyledDescription = styled(DialogPrimitive.Description)`
	margin: 10px 0 20px;
	font-size: 15px;
	line-height: 1.5;
`

// Exports
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogContent = Content
export const DialogTitle = StyledTitle
export const DialogDescription = StyledDescription
export const DialogClose = DialogPrimitive.Close
