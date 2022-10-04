import styled from 'styled-components/macro'
import {
	space,
	flexbox,
	grid,
	height,
	margin,
	width,
	padding,
	maxWidth,
} from 'styled-system'
import type {
	GridProps,
	SpaceProps,
	WidthProps,
	MarginProps,
	HeightProps,
	FlexboxProps,
	MaxWidthProps,
	PaddingProps,
} from 'styled-system'

type BoxProps = SpaceProps &
	MarginProps &
	HeightProps &
	WidthProps &
	MaxWidthProps &
	PaddingProps

export const Box = styled.div<BoxProps>`
	${space}
	${margin}
  ${height}
  ${padding}
  ${width}
  ${maxWidth}
`

export const Flex = styled(Box)<
	FlexboxProps & BoxProps & { gap?: number | string }
>`
	display: flex;
	${({ gap }) =>
		gap ? `gap: ${typeof gap === 'number' ? `${gap}px` : gap};` : undefined}
	${flexbox}
`

export const Grid = styled(Box)<
	GridProps & BoxProps & { gap?: number | string; alignItems?: string }
>`
	display: grid;
	${({ gap }) =>
		gap ? `gap: ${typeof gap === 'number' ? `${gap}px` : gap};` : undefined}
	${({ alignItems }) =>
		alignItems ? `align-items: ${alignItems};` : undefined}

  ${grid}
`
