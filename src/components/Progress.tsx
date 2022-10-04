import * as ProgressPrimitive from '@radix-ui/react-progress'
import styled, { keyframes } from 'styled-components/macro'

const StyledProgress = styled(ProgressPrimitive.Root)`
	position: relative;
	overflow: hidden;
	border-radius: 99999px;
	background: black;
	width: 100%;
	height: 25px;

	// Fix overflow clipping in Safari
	// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
	transform: translateZ(0);
`

const shine = keyframes`
	to {
			background-position-x: -200%;
	}
`

const StyledIndicator = styled(ProgressPrimitive.Indicator)`
	background: #eee;
	background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
	border-radius: 5px;
	background-size: 200% 100%;
	animation: 1.5s ${shine} linear infinite;
	width: 100%;
	height: 100%;
	transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
`

export const Progress = StyledProgress
export const ProgressIndicator = StyledIndicator
