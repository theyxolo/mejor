import styled from 'styled-components/macro'

export const TraitContent = styled.div`
	display: grid;
	width: 100%;
	font-size: 1rem;
	flex-direction: row;
	align-items: center;
	grid-template-columns: auto 1fr;
	gap: 8;
`

export const TraitImage = styled.img`
	width: 35px;
	height: 35px;
	border-radius: 8px;
	border: 1px solid var(--colors--border);
	transition: transform 0.2s ease-in-out;
	margin-right: 4px;
	background-image: var(--image--transparent);
	background-size: 16px 16px;
	background-position: 0 0, 8px 8px;
	background-color: var(--colors--background);

	&:hover {
		transform: scale(5);
		position: relative;
	}
`
