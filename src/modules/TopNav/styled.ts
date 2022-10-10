import styled from 'styled-components/macro'

export const NavList = styled.ul`
	padding: 0 20px;
	display: flex;
	justify-content: center;
	gap: 10px;
	height: 100%;
`

export const Header = styled.div`
	display: grid;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
	font-size: 1rem;
	grid-template-columns: repeat(3, 1fr);
	border-bottom: 2px solid var(--colors--border);
	font-family: SF Pro;

	h1 {
		font-weight: 900;
		font-size: 1.5rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: inherit;
		min-height: 40px;
		font-weight: 800;
		height: 100%;
		position: relative;

		span {
			gap: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--space--medium) var(--space--large);
			border-radius: 16px;
			overflow: hidden;
			opacity: 0.8;

			&:hover {
				background-color: var(--color--overlay_alternate);
				opacity: 1;
			}
		}

		&[aria-current='page'] {
			span {
				opacity: 1;
			}
			&:after {
				content: '';
				position: absolute;
				bottom: -2px;
				left: 0;
				height: 3px;
				width: 100%;
				background-color: var(--colors--background_opposite);
			}
		}
	}

	&:nth-child(2) {
		align-content: center;
	}

	&:nth-child(3) {
		align-content: flex-end;
	}
`
