import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import styled, { css, keyframes } from 'styled-components/macro'

const slideUpAndFade = keyframes`
	0% { opacity: 0; transform: translateY(2px); }
	100% { opacity: 1; transform: translateY(0); }
`

const slideRightAndFade = keyframes`
	0% { opacity: 0; transform: translateX(-2px); }
	100% { opacity: 1; transform: translateX(0); }
`

const slideDownAndFade = keyframes`
	0% { opacity: 0; transform: translateY(-2px); }
	100% { opacity: 1; transform: translateY(0); }
`

const slideLeftAndFade = keyframes`
	0% { opacity: 0; transform: translateX(2px); }
	100% { opacity: 1; transform: translateX(0); }
`

const contentStyles = css`
	min-width: 220px;
	background-color: white;
	border-radius: 6px;
	padding: 5px;
	box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
		0px 10px 20px -15px rgba(22, 23, 24, 0.2);

	@media (prefers-reduced-motion: no-preference) {
		animation-duration: 400ms;
		animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;
		&[data-state='open'] {
			&[data-side='top'] {
				animation-name: ${slideDownAndFade};
			}
			&[data-side='right'] {
				animation-name: ${slideLeftAndFade};
			}
			&[data-side='bottom'] {
				animation-name: ${slideUpAndFade};
			}
			&[data-side='left'] {
				animation-name: ${slideRightAndFade};
			}
		}
	}
`

const StyledContent = styled(DropdownMenuPrimitive.Content)`
	${contentStyles}
`

const StyledArrow = styled(DropdownMenuPrimitive.Arrow)`
	fill: white;
`

function Content({ children, ...props }: any) {
	return (
		<DropdownMenuPrimitive.Portal>
			<StyledContent {...props}>
				{children}
				<StyledArrow />
			</StyledContent>
		</DropdownMenuPrimitive.Portal>
	)
}

const StyledSubContent = styled(DropdownMenuPrimitive.SubContent)`
	${contentStyles}
`

function SubContent(props: any) {
	return (
		<DropdownMenuPrimitive.Portal>
			<StyledSubContent {...props} />
		</DropdownMenuPrimitive.Portal>
	)
}

const itemStyles = css`
	all: unset;
	font-size: 1rem;
	line-height: 1;
	color: black;
	font-weight: 700;
	border-radius: 3px;
	display: flex;
	align-items: center;
	height: 25px;
	padding: 2px 8px;
	position: relative;
	padding-left: 28px;
	user-select: none;

	&[data-disabled] {
		color: gray;
		pointer-events: none;
	}

	&[data-highlighted] {
		background-color: black;
		color: white;
	}

	> svg {
		stroke-width: 3px !important;
		position: absolute;
		left: 6px;
		width: 16px !important;
		height: 16px !important;
	}
`

const StyledItem = styled(DropdownMenuPrimitive.Item)`
	${itemStyles}
`
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem)`
	${itemStyles}
`
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem)`
	${itemStyles}
`
const StyledSubTrigger = styled(DropdownMenuPrimitive.SubTrigger)`
	&[data-state='open'] {
		background-color: black;
		color: white;
	}

	${itemStyles};
`

const StyledLabel = styled(DropdownMenuPrimitive.Label)`
	padding-left: 25px;
	font-size: 1rem;
	line-height: 25px;
	color: black;
`

const StyledSeparator = styled(DropdownMenuPrimitive.Separator)`
	height: 1;
	background-color: violet;
	margin: 5px;
`

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator)`
	position: absolute;
	left: 0;
	width: 25px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`

export const RightSlot = styled.div`
	margin-left: auto;
	color: white;

	[data-highlighted] > & {
		color: white;
	}

	[data-disabled] & {
		color: blue;
	}
`

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = Content
export const DropdownMenuItem = StyledItem
export const DropdownMenuCheckboxItem = StyledCheckboxItem
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
export const DropdownMenuRadioItem = StyledRadioItem
export const DropdownMenuItemIndicator = StyledItemIndicator
export const DropdownMenuLabel = StyledLabel
export const DropdownMenuSeparator = StyledSeparator
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuSubTrigger = StyledSubTrigger
export const DropdownMenuSubContent = SubContent
