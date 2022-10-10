import { forwardRef } from 'react'
import { MoreHorizontal } from 'react-feather'
import styled, { css } from 'styled-components/macro'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './DropdownMenu'

const buttonStyle = css<{ $primary?: boolean }>`
	text-decoration: none;
	background-color: ${({ $primary }) => ($primary ? '#9d74eb' : '#fff')};
	padding: 5px 20px;
	border: none;
	color: ${({ $primary }) => ($primary ? '#fff' : '#000')};
	box-shadow: ${({ $primary }) =>
		$primary ? '0 0 9px rgb(157, 116, 235,0.75)' : ''};
	border-radius: 20px;
	font-weight: 800;
	min-height: 30px;
`

const StyledButton = styled.button<{ $primary?: boolean }>`
	${buttonStyle}

	display: flex;
	justify-content: center;
	align-items: center;

	font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
		'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
		'Helvetica Neue', sans-serif;

	&:hover {
		${({ $primary }) => ($primary ? 'background-color: #7B5AB8;' : '')}
	}

	&[disabled] {
		opacity: 0.5;
	}
`

const Icon = styled.svg<{ noMargin?: boolean }>`
	margin-left: ${({ noMargin = false }) => (noMargin ? '' : '4px')};
	size: 20px;
	width: 20px;
	height: 20px;
	stroke-width: 2.5px;
`

const ButtonWithOptionsWrapper = styled.div`
	display: flex;

	${StyledButton}:first-child {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	${StyledButton}:nth-child(2) {
		justify-content: center;
		align-items: center;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		padding: 5px 10px;
	}
`

const Button = forwardRef(function ButtonWithRef(
	{
		options,
		primary,
		...props
	}: React.ComponentPropsWithoutRef<typeof StyledButton> & {
		options?: any[]
	},
	ref: React.ForwardedRef<any>,
) {
	if (options) {
		return (
			<ButtonWithOptionsWrapper ref={ref}>
				<StyledButton $primary={primary} {...props} />
				<DropdownMenu>
					<StyledButton $primary={primary} as={DropdownMenuTrigger}>
						<MoreHorizontal size={16} />
					</StyledButton>
					<DropdownMenuContent sideOffset={5}>
						{options.map((option) => (
							<DropdownMenuItem
								key={option.label}
								onClick={option.onClick}
								disabled={option.disabled}
							>
								{option.icon}
								{option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</ButtonWithOptionsWrapper>
		)
	}

	return <StyledButton ref={ref} {...props} />
})

export { Icon }
export default Button
