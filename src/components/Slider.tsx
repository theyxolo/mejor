import styled from 'styled-components/macro'
import * as SliderPrimitive from '@radix-ui/react-slider'

const StyledSlider = styled(SliderPrimitive.Root)`
	position: relative;
	display: flex;
	align-items: center;
	user-select: none;
	touch-action: none;
	width: 100%;

	&[data-orientation='horizontal'] {
		height: 20px;
	}

	&[data-orientation='vertical'] {
		flex-direction: column;
		width: 20px;
		height: 100px;
	}
`

const StyledRange = styled(SliderPrimitive.Range)`
	position: absolute;
	background-color: var(--colors--tint);
	border-radius: 9999px;
	height: 100%;
`

const StyledThumb = styled(SliderPrimitive.Thumb)`
	all: unset;
	display: block;
	width: 20px;
	height: 20px;
	background-color: var(--colors--background);
	box-shadow: 0 0 0 2px var(--colors--tint);
	border-radius: 10px;

	&:hover {
		background-color: var(--colors--text);
	}
	&:focus {
		box-shadow: 0 0 0 3px var(--colors--tint);
	}
`

const StyledTrack = styled(SliderPrimitive.Track)`
	background-color: #ddd;
	position: relative;
	flex-grow: 1;
	border-radius: 9999px;

	&[data-orientation='horizontal'] {
		height: 3px;
	}
	&[data-orientation='vertical'] {
		width: 3px;
	}
`

function Slider({
	value,
	onValueChange,
	// eslint-disable-next-line no-magic-numbers
	max = 100,
	step = 1,
}: {
	value: number[]
	onValueChange: (value: number[]) => void
	max?: number
	step?: number
}) {
	return (
		<StyledSlider
			onValueChange={onValueChange}
			value={value}
			max={max}
			step={step}
		>
			<StyledTrack>
				<StyledRange />
			</StyledTrack>
			<StyledThumb />
		</StyledSlider>
	)
}

export default Slider
