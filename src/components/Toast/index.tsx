import * as ToastPrimitive from '@radix-ui/react-toast'

import * as Styled from './styled'

interface Props {
	title: string
	open: boolean
	children?: React.ReactNode
	onClose: () => void
}

export const ToastProvider = ToastPrimitive.Provider
export const ToastViewport = Styled.Viewport
export const ToastTitle = Styled.Title
export const ToastDescription = Styled.Description
export const ToastAction = Styled.Action
export const ToastClose = ToastPrimitive.Close

export default function Toast(props: Props) {
	const { onClose, title, children: description, open } = props

	return (
		<>
			<Styled.Toast duration={5000} open={open} onOpenChange={() => onClose()}>
				<ToastTitle>{title}</ToastTitle>
				<ToastDescription>{description}</ToastDescription>
			</Styled.Toast>
			<ToastViewport />
		</>
	)
}
