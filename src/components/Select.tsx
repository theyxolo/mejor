import * as SelectPrimitive from '@radix-ui/react-select'
import styled, { css } from 'styled-components/macro'

const StyledTrigger = styled(SelectPrimitive.SelectTrigger)`
	all: unset;
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	border-radius: var(--border_radius--small);
	font-size: 13px;
	line-height: 1;
	min-height: 35px;
	padding: 4px 16px;
	gap: 5px;
	background-color: black;
	color: white;
	border: 1px solid var(--colors--border);
	font-weight: 800;

	&:hover {
		background-color: mauve;
	}
	&:focus {
		box-shadow: 0 0 0 2px white;
	}
	&[data-placeholder] {
		color: violet;
	}
`

const StyledIcon = styled(SelectPrimitive.SelectIcon)`
	color: white;
`

const StyledContent = styled(SelectPrimitive.Content)`
	overflow: hidden;
	background-color: black;
	border-radius: var(--border_radius--small);
	padding: 0;
	border: 1px solid var(--colors--border);
`

const StyledViewport = styled(SelectPrimitive.Viewport)`
	padding: 5;
`

function Content({ children, ...props }: any) {
	return (
		<SelectPrimitive.Portal>
			<StyledContent {...props}>{children}</StyledContent>
		</SelectPrimitive.Portal>
	)
}

const StyledItem = styled(SelectPrimitive.Item)`
	all: unset;
	font-size: 13px;
	line-height: 1;
	color: white;
	border-radius: 3px;
	display: flex;
	min-height: 35px;
	justify-content: space-between;
	align-items: center;
	padding: 0 35px 0 16px;
	position: relative;
	user-select: none;
	font-weight: 800;

	&[data-disabled] {
		color: mauve;
		pointer-events: none;
	}

	&[data-highlighted] {
		background-color: var(--colors--border);
		color: white;
	}
`

const StyledLabel = styled(SelectPrimitive.Label)`
	padding: 24px 16px 0;
	font-size: 12px;
	line-height: 25px;
	color: mauve;
	font-weight: 800;
	opacity: 0.8;
`

const StyledSeparator = styled(SelectPrimitive.Separator)`
	height: 2px;
	background-color: var(--colors--border);
	margin: 5px;
`

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator)`
	position: absolute;
	left: 0;
	width: 25px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`

const scrollButtonStyles = css`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 25px;
	background-color: white;
	color: violet;
	cursor: default;
`

const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton)`
	${scrollButtonStyles}
`

const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton)`
	${scrollButtonStyles}
`

// Exports
export const Select = SelectPrimitive.Root
export const SelectTrigger = StyledTrigger
export const SelectValue = SelectPrimitive.Value
export const SelectIcon = StyledIcon
export const SelectContent = Content
export const SelectViewport = StyledViewport
export const SelectGroup = SelectPrimitive.Group
export const SelectItem = StyledItem
export const SelectItemText = SelectPrimitive.ItemText
export const SelectItemIndicator = StyledItemIndicator
export const SelectLabel = StyledLabel
export const SelectSeparator = StyledSeparator
export const SelectScrollUpButton = StyledScrollUpButton
export const SelectScrollDownButton = StyledScrollDownButton

// // Your app...
// const Box = styled('div', {});

// export const SelectDemo = () => (
//   <Box>
//     <Select>
//       <SelectTrigger aria-label="Food">
//         <SelectValue placeholder="Select a fruit…" />
//         <SelectIcon>
//           <ChevronDownIcon />
//         </SelectIcon>
//       </SelectTrigger>
//       <SelectContent>
//         <SelectScrollUpButton>
//           <ChevronUpIcon />
//         </SelectScrollUpButton>
//         <SelectViewport>
//           <SelectGroup>
//             <SelectLabel>Fruits</SelectLabel>
//             <SelectItem value="apple">
//               <SelectItemText>Apple</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="banana">
//               <SelectItemText>Banana</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="blueberry">
//               <SelectItemText>Blueberry</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="grapes">
//               <SelectItemText>Grapes</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="pineapple">
//               <SelectItemText>Pineapple</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//           </SelectGroup>

//           <SelectSeparator />

//           <SelectGroup>
//             <SelectLabel>Vegetables</SelectLabel>
//             <SelectItem value="aubergine">
//               <SelectItemText>Aubergine</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="broccoli">
//               <SelectItemText>Broccoli</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="carrot" disabled>
//               <SelectItemText>Carrot</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="courgette">
//               <SelectItemText>Courgette</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="leek">
//               <SelectItemText>leek</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//           </SelectGroup>

//           <SelectSeparator />

//           <SelectGroup>
//             <SelectLabel>Meat</SelectLabel>
//             <SelectItem value="beef">
//               <SelectItemText>Beef</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="chicken">
//               <SelectItemText>Chicken</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="lamb">
//               <SelectItemText>Lamb</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//             <SelectItem value="pork">
//               <SelectItemText>Pork</SelectItemText>
//               <SelectItemIndicator>
//                 <CheckIcon />
//               </SelectItemIndicator>
//             </SelectItem>
//           </SelectGroup>
//         </SelectViewport>
//         <SelectScrollDownButton>
//           <ChevronDownIcon />
//         </SelectScrollDownButton>
//       </SelectContent>
//     </Select>
//   </Box>
// );

// export default SelectDemo;
