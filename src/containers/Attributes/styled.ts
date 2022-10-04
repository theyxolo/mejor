import styled from 'styled-components/macro'
import * as Slider from '@radix-ui/react-slider'

export const StyledSlider = styled(Slider.Root)`
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

export const StyledRange = styled(Slider.Range)`
	position: absolute;
	background-color: #9d74eb;
	border-radius: 9999px;
	height: 100%;
`

export const StyledThumb = styled(Slider.Thumb)`
	all: unset;
	display: block;
	width: 20px;
	height: 20px;
	background-color: white;
	box-shadow: 0 2px 10px #9d74eb;
	border-radius: 10px;

	&:hover {
		background-color: #fff;
	}
	&:focus {
		box-shadow: 0 0 0 3px #9d74eb;
	}
`

export const StyledTrack = styled(Slider.Track)`
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

export const AssetImg = styled.img`
	width: 100%;
	height: auto;
	display: block;
	border: 1px solid var(--colors--border);
	border-radius: 18px;
	background-image: linear-gradient(
			45deg,
			#222 25%,
			transparent 0,
			transparent 75%,
			#222 0
		),
		linear-gradient(45deg, #222 25%, transparent 0, transparent 75%, #222 0);
	background-size: 16px 16px;
	background-position: 0 0, 8px 8px;
`
